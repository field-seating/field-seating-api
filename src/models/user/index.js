const prisma = require('../../config/prisma');
const { statusMap } = require('../user/constants');

class UserModel {
  constructor() {}
  async createUser(data) {
    const createUser = await prisma.users.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        verificationToken: data.token,
        tokenCreatedAt: new Date(),
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

  async getUserById(id) {
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
  async verifyUser(token, { tokenShouldLater: dateTime }) {
    const verifyUser = await prisma.users.updateMany({
      where: {
        verificationToken: token,
        status: statusMap.unverified,
        tokenCreatedAt: {
          gte: dateTime,
        },
      },
      data: {
        status: statusMap.active,
        verificationToken: null,
        tokenCreatedAt: null,
      },
    });
    if (verifyUser.count === 0) return false;
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
        // **** wait to add photoCount and recordCount
      },
    });
    return userInfo;
  }
  async flushVerificationToken(data) {
    const newToken = await prisma.users.updateMany({
      where: {
        id: data.id,
        status: statusMap.unverified,
      },
      data: { verificationToken: data.token, tokenCreatedAt: new Date() },
    });
    if (newToken.count === 0) return false;
    return true;
  }
  async _truncate() {
    await prisma.users.deleteMany({});
  }
}

module.exports = UserModel;
