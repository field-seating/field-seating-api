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
        // token: data.token,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
        // token: true,
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

  async verifyUser(id) {
    const verifyUser = await prisma.users.update({
      where: {
        id: id,
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

  async getUserByEmail(email) {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    });

    return user;
  }

  async _truncate() {
    await prisma.users.deleteMany({});
  }
}

module.exports = UserModel;
