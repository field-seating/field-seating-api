const jwt = require('jsonwebtoken');
const GeneralError = require('../controllers/helpers/general-error');
const signUpErrorMap = require('../errors/sign-up-error');
const UserModel = require('../models/user');
const { jwtLife } = require('../constants/jwt-constant');
const { hashPassword } = require('../controllers/helpers/password');

const userServices = {
  signUp: async (name, email, password) => {
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
  },
  signIn: async (id) => {
    const userModel = new UserModel();
    const getUser = await userModel.getUser(id);
    const token = jwt.sign(getUser, process.env.JWT_SECRET, {
      expiresIn: jwtLife,
    });
    const user = {
      token,
      user: getUser,
    };
    return user;
  },
};
module.exports = userServices;
