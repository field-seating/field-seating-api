const prisma = require('../../config/prisma');
const { spaceTypeMap } = require('./constants');

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
      },
    });
    return getSpace;
  }
  async createSpace(zoneId, spaceType, version, colNumber, rowNumber) {
    if (spaceType === spaceTypeMap.seat) {
      const newSpace = await prisma.spaces.upsert({
        where: {
          zoneId_version_colNumber_rowNumber: {
            zoneId,
            version,
            colNumber,
            rowNumber,
          },
        },
        update: {},
        create: {
          zoneId,
          spaceType,
          version,
          colNumber,
          rowNumber,
          seats: {
            create: [{}],
          },
        },
        select: {
          id: true,
          colNumber: true,
          rowNumber: true,
          spaceType: true,
          version: true,
        },
      });
      return newSpace;
    }
    if (spaceType === spaceTypeMap.pillar) {
      const newSpace = await prisma.spaces.upsert({
        where: {
          zoneId_version_colNumber_rowNumber: {
            zoneId,
            version,
            colNumber,
            rowNumber,
          },
        },
        update: {},
        create: {
          zoneId,
          spaceType,
          version,
          colNumber,
          rowNumber,
          seats: {
            create: [{}],
          },
        },
        select: {
          id: true,
          colNumber: true,
          rowNumber: true,
          spaceType: true,
          version: true,
        },
      });
      return newSpace;
    }
  }
  async _truncate() {
    await prisma.spaces.deleteMany({});
  }
}

module.exports = SpaceModel;
