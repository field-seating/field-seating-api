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
      const createSpace = await prisma.spaces.create({
        data: {
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
    if (spaceType === spaceTypeMap.pillar) {
      const createSpace = await prisma.spaces.create({
        data: {
          zoneId,
          spaceType,
          version,
          colNumber,
          rowNumber,
          pillars: {
            create: [{}],
          },
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
  }
  async _truncate() {
    await prisma.spaces.deleteMany({});
  }
}

module.exports = SpaceModel;
