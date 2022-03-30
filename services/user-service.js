const bcrypt = require('bcryptjs');
const generalError = require('../helpers/generalError');
const errorMap = require('../errors/error-list');
const UserModel = require('../models/user');

const userServices = {
  signUp: async (name, email, password) => {
    // check input
    if (!email.trim()) throw new generalError(errorMap['signUpError'][1]);
    if (!name.trim()) throw new generalError(errorMap['signUpError'][2]);
    if (!password.trim()) throw new generalError(errorMap['signUpError'][3]);
    // find duplicate user
    const userModel = new UserModel();
    const findDuplicateUser = userModel.findDuplicateUser(email);
    if (findDuplicateUser) throw new generalError(errorMap['signUpError'][0]);
    // hash password
    const hash = await bcrypt.hash(password, 10);
    // create user
    const data = {
      name: name,
      email: email,
      password: hash,
    };
    const postUser = await userModel.createUser(data);
    return postUser;
  },
};
module.exports = userServices;
