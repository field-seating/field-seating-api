const prisma = require('../../config/prisma');
const { statusMap } = require('../user/constants');
const GeneralError = require('../../errors/error/general-error');
const verifyErrorMap = require('../../errors/verify-error');
const {
  verificationTokenLife,
} = require('../../constants/token-life-constant');
const PrivateError = require('../../errors/error/private-error');
// const { R } = require('ramda');

class UserModel {
  constructor() {}
  async createUser(data) {
    const createUser = await prisma.users.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        verificationToken: data.token,
        tokenCreatedAt: data.date,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        verificationToken: true,
      },
    });
    return createUser;
  }

  async getUser(id) {
    const getUser = await prisma.users.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });
    return getUser;
  }
  async verifyUser(token) {
    const targetUser = await prisma.users.findMany({
      where: {
        verificationToken: token,
        status: statusMap.unverified,
      },
      select: {
        id: true,
        tokenCreatedAt: true,
      },
    });
    if (!targetUser[0] || targetUser.length > 1)
      throw new GeneralError(verifyErrorMap['invalidToken']);
    const nowDate = await new Date().getTime();
    const tokenDate = targetUser[0].tokenCreatedAt;
    if (nowDate - tokenDate > verificationTokenLife)
      throw new GeneralError(verifyErrorMap['expiredToken']);
    const verifyUser = await prisma.users.updateMany({
      where: {
        id: targetUser[0].id,
        verificationToken: token,
        status: statusMap.unverified,
      },
      data: {
        status: statusMap.active,
        verificationToken: null,
        tokenCreatedAt: null,
      },
    });
    if (verifyUser.count === 0)
      throw new PrivateError(verifyErrorMap['updateFailed']);
    return true;
  }
  async getUserInfo(id) {
    const userInfo = await prisma.users.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });
    return userInfo;
  }
  async getVerificationTokenCreatedAt(id) {
    const tokenCreatedAt = await prisma.users.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        tokenCreatedAt: true,
      },
    });
    return tokenCreatedAt;
  }
  async refreshVerificationToken(data) {
    const newToken = await prisma.users.update({
      where: {
        id: data.id,
      },
      data: { verificationToken: data.token, tokenCreatedAt: data.date },
      select: {
        verificationToken: true,
      },
    });
    return newToken;
  }
  async _truncate() {
    await prisma.users.deleteMany({});
  }
}

module.exports = UserModel;
