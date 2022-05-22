const prisma = require('../config/prisma');

class LevelModel {
  constructor() {}
  async createLevel(name) {
    const createLevel = await prisma.levels.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return createLevel;
  }
  async _truncate() {
    await prisma.levels.deleteMany({});
  }
}

module.exports = LevelModel;
