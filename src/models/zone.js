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
  async _truncate() {
    await prisma.zones.deleteMany({});
  }
}

module.exports = ZoneModel;
