const prisma = require('../config/prisma');

class UserModel {
  constructor() {}
  // 原型方法
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
  async findDuplicateUser(email) {
    const findDuplicateUser = await prisma.users.findUnique({
      where: { email: email },
    });
    return findDuplicateUser;
  }
}

module.exports = UserModel;
