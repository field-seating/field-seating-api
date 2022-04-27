const BaseService = require('../base');
const PasswordResetTokenModel = require('../../models/password-reset-token');
const { randomString } = require('../../utils/crypto/random');
const { RESET_TOKEN_LENGTH } = require('./constants');

class PasswordService extends BaseService {
  async createPasswordResetToken(userId) {
    const passwordResetTokenModel = new PasswordResetTokenModel();

    const token = await randomString(RESET_TOKEN_LENGTH);
    const tokenSignedAt = new Date();

    const entity = await passwordResetTokenModel.createAndInvalidateOthers(
      userId,
      token,
      tokenSignedAt
    );

    return entity.token;
  }
}

module.exports = PasswordService;
