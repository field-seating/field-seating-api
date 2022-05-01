const {
  baseUrl,
  verifyEmail,
  passwordResetEmail,
} = require('../config/config');
const sendEmail = require('./helpers/send-email');
const withRetry = require('../utils/func/retry');
const BaseService = require('./base');
const { EFFECTIVE_PERIOD_IN_HOURS } = require('./password-service/constants');
const rateLimiterHelper = require('../utils/rate-limiter');
const rateLimiterErrorMap = require('../errors/rate-limiter-error');
const sendEmailErrorMap = require('../errors/send-email-error');
const GeneralError = require('../errors/error/general-error');

class EmailService extends BaseService {
  async sendVerifyEmail(user) {
    const meta = {
      receiverList: [
        {
          email: user.email,
          name: user.name,
        },
      ],
      subject: '帳號驗證信',
    };

    const data = {
      name: user.name,
      email: user.email,
      url: `${baseUrl}/verify-email/${user.verificationToken}`,
    };

    const template = 'verify-email';

    // send email
    async function send() {
      const sendInfo = await sendEmail(template, meta, data);
      const result = {
        ...sendInfo,
        token: user.verificationToken,
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

  async sendPasswordResetMail(user, passwordResetTokenEntity, requestTime) {
    const { token } = passwordResetTokenEntity;
    const meta = {
      receiverList: [
        {
          email: user.email,
          name: user.name,
        },
      ],
      subject: '密碼重置',
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

    const withRateLimit = rateLimiterHelper({
      windowSize: passwordResetEmail.rateLimit.windowSize,
      limit: passwordResetEmail.rateLimit.limit,
      key: `sendPasswordResetMail:${user.email}`,
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
