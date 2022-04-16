const jwt = require('jsonwebtoken');
const { jwtSecret, baseUrl, verifyEmail } = require('../config/config');
const sendEmail = require('./helpers/send-email');
const PrivateError = require('../errors/error/private-error');
const sendEmailErrorMap = require('../errors/send-email-error');
const withRetry = require('../utils/func/retry');
const BaseService = require('./base');

class EmailService extends BaseService {
  async sendVerifyEmail(user) {
    // create token
    const token = jwt.sign(user, jwtSecret, {
      expiresIn: verifyEmail.verifyTokenLife,
    });
    const meta = {
      emailList: [
        {
          email: user.email,
          name: user.name,
        },
      ],
      subject: '球場坐座帳號驗證信',
    };
    const data = {
      name: user.name,
      email: user.email,
      url: `${baseUrl}/verify-email/${token}`,
    };
    const template = 'verify-email';
    // send email
    async function send() {
      const sendInfo = await sendEmail(template, meta, data);
      const result = {
        ...sendInfo,
        token: token,
      };
      return result;
    }
    try {
      const emailInfo = await withRetry(send, { maxTries: 3 });
      this.logger.info('sent email', {});
      return emailInfo;
    } catch (err) {
      //developers.sendinblue.com/docs/how-it-works#endpoints
      if (err.status === 401)
        throw new PrivateError(sendEmailErrorMap['apiKeyError']);
      if (err.status === 400)
        throw new PrivateError(sendEmailErrorMap['badRequestError']);
      if (err.status === 429)
        throw new PrivateError(sendEmailErrorMap['toManyRequestError']);
      throw err;
    }
  }
}

module.exports = EmailService;
