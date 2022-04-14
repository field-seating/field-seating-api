const jwt = require('jsonwebtoken');
const { verifyTokenLife } = require('../constants/jwt-constant');
const { jwtSecret, baseUrl } = require('../config/config');
const sendEmail = require('../controllers/helpers/send-email');
const GeneralError = require('../controllers/helpers/general-error');
const sendEmailErrorMap = require('../errors/send-email-error');
const retry = require('../controllers/helpers/retry');

const emailService = {
  sendVerifyEmail: async (user) => {
    // create token
    const token = jwt.sign(user, jwtSecret, {
      expiresIn: verifyTokenLife,
    });
    const data = {
      name: user.name,
      email: user.email,
      url: `${baseUrl}/verify-email/${token}`,
    };
    // send email
    async function send() {
      const sendInfo = await sendEmail(data);
      const result = {
        ...sendInfo,
        token: token,
      };
      return result;
    }
    try {
      return await send();
    } catch (err) {
      //developers.sendinblue.com/docs/how-it-works#endpoints
      if (err.status === 401)
        throw new GeneralError(sendEmailErrorMap['apiKeyError']);
      if (err.status === 400)
        throw new GeneralError(sendEmailErrorMap['badRequestError']);
      if (err.status === 429)
        throw new GeneralError(sendEmailErrorMap['toManyRequestError']);
      return retry(send());
    }
  },
};
module.exports = emailService;
