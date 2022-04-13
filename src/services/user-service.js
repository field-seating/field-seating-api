const jwt = require('jsonwebtoken');

const GeneralError = require('../errors/error/general-error');
const signUpErrorMap = require('../errors/sign-up-error');
const UserModel = require('../models/user');
const { jwtLife } = require('../constants/jwt-constant');
const { hashPassword } = require('../controllers/helpers/password');
const { jwtSecret } = require('../config/config');
const BaseService = require('./base');

class UserService extends BaseService {
  async signUp(name, email, password) {
    // hash password
    const hash = await hashPassword(password);

    // create user
    const userModel = new UserModel();
    const data = {
      name: name,
      email: email,
      password: hash,
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
}

module.exports = UserService;
