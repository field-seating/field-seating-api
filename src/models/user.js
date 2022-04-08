const prisma = require('../config/prisma');
const sendEmail = require('../middleware/send-email');

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
    sendEmail;
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
      },
    });
    return getUser;
  }
  async _truncate() {
    await prisma.users.deleteMany({});
  }
}

module.exports = UserModel;
