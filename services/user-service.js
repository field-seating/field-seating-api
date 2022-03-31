const bcrypt = require('bcryptjs');
const generalError = require('../controllers/helpers/general-error');
const signUpErrorMap = require('../errors/signUpError');
const UserModel = require('../models/user');

const userServices = {
  signUp: async (name, email, password) => {
    // check input
    if (!email.trim()) throw new generalError(signUpErrorMap['emailRequired']);
    if (!name.trim()) throw new generalError(signUpErrorMap['nameRequired']);
    if (!password.trim())
      throw new generalError(signUpErrorMap['passwordRequired']);
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
      if (err.code === 'P2002')
        throw new generalError(signUpErrorMap['duplicateEmail']);
    }
  },
};
module.exports = userServices;
