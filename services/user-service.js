// use prisma
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcryptjs');
const { signUpError1, signUpError2 } = require('../helpers/appError');
const userServices = {
  signUp: async (req, cb) => {
    try {
      const { name, email, password } = req.body;
      // find existed email
      const user = await prisma.users.findUnique({ where: { email: email } });
      if (user) throw new signUpError1();
      if (!email.trim()) throw new signUpError2();
      if (!name.trim()) throw new Error('名字為必填欄位！');
      if (!password.trim()) throw new Error('密碼為必填欄位！');
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
