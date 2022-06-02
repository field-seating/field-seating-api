const prisma = require('../config/prisma');

class ZoneModel {
  constructor() {}
  async createZone(fieldId, orientationId, levelId, name) {
    const newZone = await prisma.zones.create({
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
    return newZone;
  }
  async getZoneByName(fieldId, name) {
    const zone = await prisma.zones.findMany({
      where: {
        fieldId: fieldId,
        name: name,
      },
      select: {
        id: true,
      },
    });
    return zone;
  }
  async getFieldZones(fieldId, orientationId, levelId) {
    const zone = await prisma.zones.findMany({
      where: {
        fieldId: Number(fieldId),
        orientationId: Number(orientationId),
        levelId: Number(levelId),
      },
      select: {
        id: true,
        fieldId: true,
        orientationId: true,
        levelId: true,
        name: true,
      },
    });
    return zone;
  }
  async _truncate() {
    await prisma.zones.deleteMany({});
  }
}

module.exports = ZoneModel;
