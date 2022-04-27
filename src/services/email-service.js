const jwt = require('jsonwebtoken');
const { jwtSecret, baseUrl, verifyEmail } = require('../config/config');
const sendEmail = require('./helpers/send-email');
const withRetry = require('../utils/func/retry');
const BaseService = require('./base');
const { EFFECTIVE_PERIOD_IN_HOURS } = require('./password-service/constants');

class EmailService extends BaseService {
  async sendVerifyEmail(user) {
    // create token
    const token = jwt.sign(user, jwtSecret, {
      expiresIn: verifyEmail.verifyTokenLife,
    });
    const meta = {
      receiverList: [
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
    const emailInfo = await withRetry(send, { maxTries: 3 });
    this.logger.info('sent email', { emailInfo });
    return emailInfo;
  }
  async sendPasswordResetMail(user, token, requestTime) {
    const meta = {
      receiverList: [
        {
          email: user.email,
          name: user.name,
        },
      ],
      subject: '球場坐座 - 密碼重置',
    };

    const data = {
      name: user.name,
      url: `${baseUrl}/password-reset/${token}`,
      time: requestTime,
      effectiveHours: EFFECTIVE_PERIOD_IN_HOURS,
    };

    const template = 'password-reset';

    async function send() {
      const sendInfo = await sendEmail(template, meta, data);
      const result = {
        ...sendInfo,
        token: token,
      };
      return result;
    }

    const emailInfo = await withRetry(send, { maxTries: 3 });

    this.logger.info('sent email', { emailInfo });
  }
}

module.exports = EmailService;
