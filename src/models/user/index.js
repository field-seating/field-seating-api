const prisma = require('../../config/prisma');
const { statusMap } = require('../user/constants');
const GeneralError = require('../../errors/error/general-error');
const verifyErrorMap = require('../../errors/verify-error');

class UserModel {
  constructor() {}
  async createUser(data) {
    const createUser = await prisma.users.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
        verification_token: data.token,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        verification_token: true,
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
    const targetUser = await prisma.users.findUnique({
      where: {
        verification_token: token,
      },
    });
    if (targetUser === null)
      throw new GeneralError(verifyErrorMap['invalidToken']);
    if (targetUser) {
      const nowDate = await new Date().getTime();
      const tokenDate = await targetUser.updatedAt.getTime();
      console.log(nowDate - tokenDate);
      if (nowDate - tokenDate > 86400000)
        throw new GeneralError(verifyErrorMap['expiredToken']);
      if (targetUser.status === statusMap.active)
        throw new GeneralError(verifyErrorMap['alreadyVerified']);
      if (targetUser.status === statusMap.inactive)
        throw new GeneralError(verifyErrorMap['inactive']);
      const verifyUser = await prisma.users.update({
        where: {
          id: targetUser.id,
        },
        data: { status: statusMap.active },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
        },
      });
      return verifyUser;
    }
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
  async _truncate() {
    await prisma.users.deleteMany({});
  }
}

module.exports = UserModel;
