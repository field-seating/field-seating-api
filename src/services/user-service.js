const jwt = require('jsonwebtoken');

const GeneralError = require('../errors/error/general-error');
const signUpErrorMap = require('../errors/sign-up-error');
const UserModel = require('../models/user');
const {
  jwtLife,
  verificationTokenLife,
  resendLimitTime,
} = require('../constants/token-life-constant');
const { hashPassword } = require('../utils/func/password');
const { jwtSecret } = require('../config/config');
const BaseService = require('./base');
const tokenGenerator = require('./helpers/token-generator');
const resendVerifyEmailErrorMap = require('../errors/resend-verify-email-error');

class UserService extends BaseService {
  async signUp(name, email, password) {
    // hash password
    const hash = await hashPassword(password);
    const token = await tokenGenerator();
    const userModel = new UserModel();
    const data = {
      name: name,
      email: email,
      password: hash,
      token: token,
      date: new Date(),
    };
    try {
      const postUser = await userModel.createUser(data);
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
    const getUser = await userModel.getUser(id);

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
    const verifyUser = await userModel.verifyUser(token);
    return verifyUser;
  }

  async getUserInfo(id) {
    const userModel = new UserModel();
    const userInfo = await userModel.getUserInfo(id);
    this.logger.debug('got a userInfo', { userInfo });
    return userInfo;
  }

  async refreshToken(id) {
    const nowDate = await new Date().getTime();
    const userModel = new UserModel();
    const tokenInfo = await userModel.getVerificationTokenCreatedAt(id);
    const tokenDate = tokenInfo.tokenCreatedAt;
    if (
      nowDate - tokenDate < verificationTokenLife &&
      nowDate - tokenDate < resendLimitTime
    )
      throw new GeneralError(resendVerifyEmailErrorMap['duplicateSend']);
    const token = await tokenGenerator();
    const data = {
      id: id,
      token: token,
      date: new Date(),
    };
    const refreshToken = await userModel.refreshVerificationToken(data);
    return refreshToken;
  }
}

module.exports = UserService;
