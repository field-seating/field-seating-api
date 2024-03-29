const prisma = require('../../config/prisma');

class ZoneModel {
  constructor() {}
  async createZone(fieldId, orientationId, levelId, name, xMirror) {
    const newZone = await prisma.zones.create({
      data: {
        fieldId,
        orientationId,
        levelId,
        name,
        xMirror,
      },
      select: {
        id: true,
        fieldId: true,
        orientationId: true,
        levelId: true,
        name: true,
        xMirror: true,
      },
    });
    return newZone;
  }
  async findOrCreateZone(fieldId, orientationId, levelId, name, xMirror) {
    const zone = await prisma.zones.upsert({
      where: { fieldId_name: { fieldId, name } },
      update: {},
      create: {
        fieldId,
        orientationId,
        levelId,
        name,
        xMirror,
      },
      select: {
        id: true,
        fieldId: true,
        orientationId: true,
        levelId: true,
        name: true,
        xMirror: true,
      },
    });
    return zone;
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
  async getZonesByField(fieldId, orientationId, levelId) {
    const zone = await prisma.zones.findMany({
      where: {
        fieldId: fieldId ? Number(fieldId) : {},
        orientationId: orientationId ? Number(orientationId) : {},
        levelId: levelId ? Number(levelId) : {},
      },
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        fieldId: true,
        orientationId: true,
        levelId: true,
        name: true,
        xMirror: true,
      },
    });
    return zone;
  }
  async getZone(id) {
    const zone = await prisma.zones.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        fieldId: true,
        orientationId: true,
        levelId: true,
        name: true,
        xMirror: true,
      },
    });
    return zone;
  }
  async _truncate() {
    await prisma.zones.deleteMany({});
  }
}

module.exports = ZoneModel;
