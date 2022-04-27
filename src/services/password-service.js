const BaseService = require('./base');

class PasswordService extends BaseService {
  async createPasswordResetToken(userId) {
    console.log({ userId });
    return 'token';
  }
}

module.exports = PasswordService;
