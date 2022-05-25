const prisma = require('../config/prisma');

class ZoneModel {
  constructor() {}
  async createZone(fieldId, orientationId, levelId, name) {
    const createZone = await prisma.zones.create({
      data: {
        fieldId,
        orientationId,
        levelId,
        name,
      },
      select: {
        id: true,
        fieldId: true,
        orientationId: true,
        levelId: true,
        name: true,
      },
    });
    return createZone;
  }
  async searchZone(fieldId, name) {
    const searchZone = await prisma.zones.findMany({
      where: {
        fieldId: fieldId,
        name: name,
      },
      select: {
        id: true,
      },
    });
    return searchZone;
  }
  async _truncate() {
    await prisma.zones.deleteMany({});
  }
}

module.exports = ZoneModel;
