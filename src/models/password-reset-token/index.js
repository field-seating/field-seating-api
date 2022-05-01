const { omit, isNil } = require('ramda');

const { stateMap } = require('./constants');
const prisma = require('../../config/prisma');

class PasswordResetToken {
  async createAndInvalidateOthers(userId, token, tokenSignedAt) {
    const [, newEntity] = await prisma.$transaction([
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

    return omit(['createdAt', 'updatedAt'])(newEntity);
  }

  async deactivateByTokenAndSignedAfter(token, signedBefore) {
    return await prisma.$transaction(async (prisma) => {
      const entity = await prisma.passwordResetTokens.findUnique({
        where: {
          token,
        },
      });

      if (isNil(entity)) {
        return null;
      }

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

      if (count === 0) {
        return null;
      }

      return entity;
    });
  }

  async _truncate() {
    await prisma.passwordResetTokens.deleteMany({});
  }
}

module.exports = PasswordResetToken;
