const jwt = require('jsonwebtoken');
const { subSeconds } = require('date-fns');
const GeneralError = require('../../errors/error/general-error');
const PrivateError = require('../../errors/error/private-error');
const signUpErrorMap = require('../../errors/sign-up-error');
const UserModel = require('../../models/user');
const { jwtLife } = require('../../constants/token-life-constant');
const { hashPassword } = require('../../utils/crypto/password');
const { jwtSecret } = require('../../config/config');
const BaseService = require('../base');
const EmailService = require('../email-service');
const tokenGenerator = require('../helpers/token-generator');
const verifyErrorMap = require('../../errors/verify-error');
const resendVerifyEmailErrorMap = require('../../errors/resend-verify-email-error');
const {
  verificationTokenLife,
} = require('../../constants/token-life-constant');
const { statusMap } = require('../../models/user/constants');

class UserService extends BaseService {
  async signUp(name, email, password) {
    // hash password
    const hash = await hashPassword(password, 10);
    const token = await tokenGenerator();
    const userModel = new UserModel();
    const userData = {
      name: name,
      email: email,
      password: hash,
      token: token,
    };
    try {
      const postUser = await userModel.createUser(userData);
      return postUser;
    } catch (err) {
      if (err.code === 'P2000' && err.meta.target === 'Users_name_key') {
        throw new PrivateError(signUpErrorMap['maximumExceededNameForDev']);
      }
      if (err.code === 'P2002' && err.meta.target === 'Users_email_key') {
        throw new GeneralError(signUpErrorMap['duplicateEmail']);
      }
      if (err.code === 'P2002' && err.meta.target === 'Users_name_key') {
        throw new GeneralError(signUpErrorMap['duplicateName']);
      }
      throw err;
    }
  }

  async signIn(id) {
    const userModel = new UserModel();
    const getUser = await userModel.getUserById(id);

    // demo for local logger
    this.logger.debug('got a user', { user: getUser });
    const token = jwt.sign(getUser, jwtSecret, {
      expiresIn: jwtLife,
    });
    const user = {
      token,
      user: getUser,
    };
    return user;
  }

  async verifyEmail(token) {
    // update user
    const userModel = new UserModel();
    const verifyLimitTime = subSeconds(new Date(), verificationTokenLife);
    const verifyUser = await userModel.verifyUser(token, {
      tokenShouldLater: verifyLimitTime,
    });
    if (!verifyUser) throw new GeneralError(verifyErrorMap['invalidToken']);
    return verifyUser;
  }

  async getUserInfo(id) {
    const userModel = new UserModel();
    const userInfo = await userModel.getUserById(id);
    this.logger.debug('got a userInfo', { userInfo });
    return userInfo;
  }

  async updateUser(id, payload) {
    const userModel = new UserModel();

    try {
      const user = await userModel.updateUser(id, payload);

      this.logger.debug('update the user', { user });

      return user;
    } catch (err) {
      if (err.code === 'P2002' && err.meta.target === 'Users_name_key') {
        throw new GeneralError(signUpErrorMap['duplicateName']);
      }

      throw err;
    }
  }

  async resendVerifyEmail(user) {
    // judge status
    if (user.status === statusMap.active)
      throw new GeneralError(resendVerifyEmailErrorMap['alreadyVerified']);
    if (user.status === statusMap.inactive)
      throw new GeneralError(resendVerifyEmailErrorMap['inactive']);

    // generate new token
    const newToken = await tokenGenerator();
    const userData = {
      email: user.email,
      name: user.name,
      verificationToken: newToken,
    };

    // send verify email
    const emailService = new EmailService({ logger: this.logger });
    await emailService.sendVerifyEmail(userData);

    // flush token
    const data = {
      id: user.id,
      token: newToken,
    };
    const userModel = new UserModel();
    const flushResult = await userModel.flushVerificationToken(data);
    if (!flushResult)
      throw new PrivateError(resendVerifyEmailErrorMap['flushFailed']);

    return newToken;
  }
}

module.exports = UserService;
