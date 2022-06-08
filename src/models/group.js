const prisma = require('../config/prisma');

class GroupModel {
  constructor() {}
  async _truncate() {
    await prisma.groups.deleteMany({});
  }
}

module.exports = GroupModel;
