const { isNil } = require('ramda');

const BaseService = require('../base');
const PasswordResetTokenModel = require('../../models/password-reset-token');
const UserModel = require('../../models/user');
const { randomString } = require('../../utils/crypto/random');
const { RESET_TOKEN_LENGTH } = require('./constants');
const GeneralError = require('../../errors/error/general-error');
const passwordErrorMap = require('../../errors/password-error');

class PasswordService extends BaseService {
  async recoveryPassword(email) {
    const passwordResetTokenModel = new PasswordResetTokenModel();
    const userModel = new UserModel();
    const user = await userModel.getUserByEmail(email);

    if (isNil(user)) {
      throw new GeneralError(passwordErrorMap.emailInvalid);
    }

    const token = await randomString(RESET_TOKEN_LENGTH);
    const tokenSignedAt = new Date();

    const entity = await passwordResetTokenModel.createAndInvalidateOthers(
      user.id,
      token,
      tokenSignedAt
    );

    return {
      user,
      passwordResetToken: entity,
    };
  }

  async updatePassword(token, newPassword) {
    this.logger.info('hits', { token, newPassword });
  }
}

module.exports = PasswordService;
