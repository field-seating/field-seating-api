const { omit } = require('ramda');

const { stateMap } = require('./constants');
const prisma = require('../../config/prisma');

class PasswordResetToken {
  async createAndInvalidateOthers(userId, token, tokenSignedAt) {
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
          tokenSignedAt,
          state: stateMap.valid,
        },
      }),
    ]);

    return omit(['createdAt', 'updatedAt'])(newPasswordResetToken);
  }

  async updateStateByTokenAndSignedAfter(token, signedBefore) {
    const { count } = await prisma.passwordResetTokens.updateMany({
      data: { state: stateMap.invalid },
      where: {
        state: stateMap.valid,
        token,
        tokenSignedAt: {
          gte: signedBefore,
        },
      },
    });

    return count;
  }

  async _truncate() {
    await prisma.passwordResetTokens.deleteMany({});
  }
}

module.exports = PasswordResetToken;
