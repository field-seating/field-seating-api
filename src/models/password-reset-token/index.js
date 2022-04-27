const prisma = require('../../config/prisma');
const { omit } = require('ramda');

class PasswordResetToken {
  async create(data) {
    const current = new Date();

    const newPasswordResetToken = prisma.passwordResetTokens.create({
      data: {
        userId: data.userId,
        token: data.token,
        tokenSignedAt: current,
      },
    });

    return omit(['createdAt', 'updatedAt'])(newPasswordResetToken);
  }
}

module.exports = PasswordResetToken;
