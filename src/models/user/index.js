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

  async updateUser(id, payload) {
    const user = await prisma.users.update({
      where: {
        id,
      },
      data: {
        name: payload.name,
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
