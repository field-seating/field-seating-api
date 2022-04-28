const jwt = require('jsonwebtoken');

const { jwtSecret, baseUrl, verifyEmail } = require('../config/config');
const sendEmail = require('./helpers/send-email');
const withRetry = require('../utils/func/retry');
const BaseService = require('./base');
const rateLimiterHelper = require('../utils/rate-limiter');
const rateLimiterErrorMap = require('../errors/rate-limiter-error');
const sendEmailErrorMap = require('../errors/send-email-error');
const GeneralError = require('../errors/error/general-error');

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

    const withRateLimit = rateLimiterHelper({
      windowSize: verifyEmail.rateLimit.windowSize,
      limit: verifyEmail.rateLimit.limit,
      key: `sendVerifyEmail:${user.email}`,
    });

    const sendMailFunc = () => withRetry(send, { maxTries: 3 });

    try {
      const emailInfo = await withRateLimit(sendMailFunc)();
      this.logger.info('sent email', { emailInfo });
      return emailInfo;
    } catch (err) {
      if (err.code === rateLimiterErrorMap.exceedLimit.code) {
        throw new GeneralError(sendEmailErrorMap.exceedLimitError);
      }
      throw err;
    }
  }
}

module.exports = EmailService;
