const prisma = require('../config/prisma');

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
      data: { status: 'verified' },
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
  async _truncate() {
    await prisma.users.deleteMany({});
  }
}

module.exports = UserModel;
