const prisma = require('../../config/prisma');

class LevelModel {
  constructor() {}
  async createLevel(name) {
    const newLevel = await prisma.levels.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return newLevel;
  }
  async findOrCreateLevel(name) {
    const level = await prisma.levels.upsert({
      where: { name },
      update: {},
      create: { name },
      select: {
        id: true,
        name: true,
      },
    });
    return level;
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
  async getLevelsByField(fieldId) {
    const levelList = await prisma.levels.findMany({
      where: {
        fields: {
          some: {
            fieldId: Number(fieldId),
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
    return levelList;
  }
  async _truncate() {
    await prisma.levels.deleteMany({});
  }
}

module.exports = LevelModel;
