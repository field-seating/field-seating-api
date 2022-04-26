const prisma = require('../../config/prisma');
const { statusMap } = require('../user/constants');
const GeneralError = require('../../errors/error/general-error');
const verifyErrorMap = require('../../errors/verify-error');
const resendVerifyEmailErrorMap = require('../../errors/resend-verify-email-error');
const {
  verificationTokenLife,
  resendLimitTime,
} = require('../../constants/token-life-constant');
const { subDays, subMinutes } = require('date-fns');

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
    const expiredTime = subDays(new Date(), verificationTokenLife);
    const verifyUser = await prisma.users.updateMany({
      where: {
        verificationToken: token,
        status: statusMap.unverified,
        tokenCreatedAt: {
          // 原發送時間需晚於 expiredTime
          gte: expiredTime,
        },
      },
      data: {
        status: statusMap.active,
        verificationToken: null,
        tokenCreatedAt: null,
      },
    });
    if (verifyUser.count === 0)
      throw new GeneralError(verifyErrorMap['invalidToken']);
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
  async refreshVerificationToken(data) {
    const resendTime = subMinutes(new Date(), resendLimitTime);
    const newToken = await prisma.users.updateMany({
      where: {
        id: data.id,
        status: statusMap.unverified,
        tokenCreatedAt: {
          // 原發送時間需小於 resendTime
          lte: resendTime,
        },
      },
      data: { verificationToken: data.token, tokenCreatedAt: data.date },
    });
    if (newToken.count === 0)
      throw new GeneralError(resendVerifyEmailErrorMap['duplicateSend']);
    return true;
  }
  async _truncate() {
    await prisma.users.deleteMany({});
  }
}

module.exports = UserModel;
