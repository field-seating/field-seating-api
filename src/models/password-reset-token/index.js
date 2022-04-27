const { omit } = require('ramda');

const { stateMap } = require('./constants');
const prisma = require('../../config/prisma');

class PasswordResetToken {
  async createAndInvalidateOthers(userId, token) {
    const current = new Date();

    const [newPasswordResetToken] = await prisma.$transaction([
      prisma.passwordResetTokens.updateMany({
        data: { state: stateMap.invalid },
        where: { userId, state: { equals: stateMap.valid } },
      }),
      prisma.passwordResetTokens.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          token,
          tokenSignedAt: current,
          state: stateMap.valid,
        },
      }),
    ]);

    return omit(['createdAt', 'updatedAt'])(newPasswordResetToken);
  }

  async _truncate() {
    await prisma.passwordResetTokens.deleteMany({});
  }
}

module.exports = PasswordResetToken;
