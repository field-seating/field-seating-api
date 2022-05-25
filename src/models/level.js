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
  async searchLevel(name) {
    const searchLevel = await prisma.levels.findUnique({
      where: {
        name: name,
      },
      select: {
        id: true,
      },
    });
    return searchLevel;
  }
  async _truncate() {
    await prisma.levels.deleteMany({});
  }
}

module.exports = LevelModel;
