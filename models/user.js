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
        email: true,
        name: true,
        role: true,
      },
    });
    return createUser;
  }
}

module.exports = UserModel;
