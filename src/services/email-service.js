const { baseUrl } = require('../config/config');
const sendEmail = require('./helpers/send-email');
const withRetry = require('../utils/func/retry');
const BaseService = require('./base');

class EmailService extends BaseService {
  async sendVerifyEmail(user) {
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
    const emailInfo = await withRetry(send, { maxTries: 3 });
    this.logger.info('sent email', { emailInfo });
    return emailInfo;
  }
}

module.exports = EmailService;
