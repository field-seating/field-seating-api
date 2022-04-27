const BaseService = require('../base');
const PasswordResetTokenModel = require('../../models/password-reset-token');
const { randomString } = require('../../utils/crypto/random');
const { RESET_TOKEN_LENGTH } = require('./constants');
const EmailService = require('../email-service');

class PasswordService extends BaseService {
  // TODO: limit mail sending rate
  async createPasswordResetToken(user) {
    const passwordResetTokenModel = new PasswordResetTokenModel();

    const token = await randomString(RESET_TOKEN_LENGTH);
    const tokenSignedAt = new Date();

    const entity = await passwordResetTokenModel.createAndInvalidateOthers(
      user.id,
      token,
      tokenSignedAt
    );

    const emailService = new EmailService({ req: this.req });

    await emailService.sendPasswordResetMail(
      user,
      entity,
      this.req.requestTime
    );
  }
}

module.exports = PasswordService;
