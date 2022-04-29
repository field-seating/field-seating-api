const jwt = require('jsonwebtoken');
const { subSeconds } = require('date-fns');
const GeneralError = require('../errors/error/general-error');
const PrivateError = require('../errors/error/private-error');
const signUpErrorMap = require('../errors/sign-up-error');
const UserModel = require('../models/user');
const { jwtLife } = require('../constants/token-life-constant');
const { hashPassword } = require('../utils/func/password');
const { jwtSecret } = require('../config/config');
const BaseService = require('./base');
const tokenGenerator = require('./helpers/token-generator');
const verifyErrorMap = require('../errors/verify-error');
const resendVerifyEmailErrorMap = require('../errors/resend-verify-email-error');
const { verificationTokenLife } = require('../constants/token-life-constant');

class UserService extends BaseService {
  async signUp(name, email, password) {
    // hash password
    const hash = await hashPassword(password);
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
      if (err.code === 'P2002') {
        throw new GeneralError(signUpErrorMap['duplicateEmail']);
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

  async flushToken(id) {
    const userModel = new UserModel();
    const token = await tokenGenerator();
    const data = {
      id: id,
      token: token,
    };
    const flushResult = await userModel.flushVerificationToken(data);
    if (!flushResult)
      throw new PrivateError(resendVerifyEmailErrorMap['flushFailed']);
    return token;
  }
}

module.exports = UserService;
