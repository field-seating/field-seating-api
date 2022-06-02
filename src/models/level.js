const prisma = require('../config/prisma');

class LevelModel {
  constructor() {}
  async createLevel(name) {
    const newLevel = await prisma.levels.upsert({
      where: { name },
      update: {},
      create: { name },
      select: {
        id: true,
        name: true,
      },
    });
    return newLevel;
  }
  async getLevelByName(name) {
    const level = await prisma.levels.findUnique({
      where: {
        name: name,
      },
      select: {
        id: true,
      },
    });
    return level;
  }
  async _truncate() {
    await prisma.levels.deleteMany({});
  }
}

module.exports = LevelModel;
