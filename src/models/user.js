const prisma = require('../config/prisma');

class UserModel {
  constructor() {}
  async createUser(data) {
    const createUser = await prisma.users.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.password,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
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
  async getUserInfo(id) {
    const getUser = await prisma.users.count({
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
  async _truncate() {
    await prisma.users.deleteMany({});
  }
}

module.exports = UserModel;
