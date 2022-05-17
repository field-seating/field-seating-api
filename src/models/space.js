const prisma = require('../config/prisma');

class SpaceModel {
  constructor() {}
  async getSpace(id) {
    const getSpace = await prisma.spaces.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        colNumber: true,
        rowNumber: true,
        zone: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return getSpace;
  }
  async createSpace(zoneId, spaceType, version, colNumber, rowNumber) {
    const createSpace = await prisma.spaces.create({
      data: {
        zoneId,
        spaceType,
        version,
        colNumber,
        rowNumber,
      },
      select: {
        id: true,
        colNumber: true,
        rowNumber: true,
        spaceType: true,
        version: true,
        zone: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return createSpace;
  }
  async _truncate() {
    await prisma.spaces.deleteMany({});
  }
}

module.exports = SpaceModel;
