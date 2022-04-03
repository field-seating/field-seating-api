const bcrypt = require('bcryptjs');

const GeneralError = require('../controllers/helpers/general-error');
const signUpErrorMap = require('../errors/signUpError');
const UserModel = require('../models/user');

const userServices = {
  signUp: async (name, email, password) => {
    // hash password
    const hash = await bcrypt.hash(password, 10);

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
};
module.exports = userServices;
