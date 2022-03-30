const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const generalError = require('../helpers/generalError');
const errorMap = require('../errors/error-list');

const userServices = {
  signUp: async (req, cb) => {
    try {
      const { name, email, password } = req.body;
      // find existed email
      const user = await prisma.users.findUnique({ where: { email: email } });
      if (user) throw new generalError(errorMap['signUpError'][0]);
      if (!email.trim()) throw new generalError(errorMap['signUpError'][1]);
      if (!name.trim()) throw new generalError(errorMap['signUpError'][2]);
      if (!password.trim()) throw new generalError(errorMap['signUpError'][3]);
      // hash password
      const hash = await bcrypt.hash(password, 10);
      // create user
      const postUser = await prisma.users.create({
        data: {
          email: email,
          name: name,
          password: hash,
        },
      });
      // return info
      const result = postUser;
      delete result.password;
      return cb(null, result);
    } catch (err) {
      cb(err);
    }
  },
};
module.exports = userServices;
