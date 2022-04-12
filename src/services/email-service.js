const jwt = require('jsonwebtoken');
const { verifyTokenLife } = require('../constants/jwt-constant');
const { jwtSecret } = require('../config/config');
const sendVerifyEmail = require('../controllers/helpers/send-email');

const emailService = {
  sendVerifyEmail: async (user) => {
    // create user
    const token = jwt.sign(user, jwtSecret, {
      expiresIn: verifyTokenLife,
    });
    const data = {
      name: user.name,
      email: user.email,
      token: token,
    };
    const sendEmail = await sendVerifyEmail(data);
    console.log(sendEmail);
    return sendEmail;
  },
};
module.exports = emailService;
