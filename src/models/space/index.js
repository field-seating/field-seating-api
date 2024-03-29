const prisma = require('../../config/prisma');
const { spaceTypeMap } = require('./constants');

class SpaceModel {
  constructor() {}
  async getSpace(id) {
    const space = await prisma.spaces.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        zoneId: true,
        spaceType: true,
        version: true,
        colNumber: true,
        rowNumber: true,
        name: true,
        positionColNumber: true,
        positionRowNumber: true,
        zone: {
          select: {
            id: true,
            name: true,
            levelId: true,
            orientationId: true,
            field: {
              select: {
                id: true,
                name: true,
                img: true,
              },
            },
          },
        },
      },
    });
    return space;
  }
  async createSpace(
    zoneId,
    spaceType,
    version,
    colNumber,
    rowNumber,
    name,
    positionColNumber,
    positionRowNumber
  ) {
    if (spaceType === spaceTypeMap.seat) {
      const newSpace = await prisma.spaces.create({
        data: {
          zoneId,
          name: name ? name : '',
          spaceType,
          version,
          colNumber,
          rowNumber,
          positionColNumber,
          positionRowNumber,
          seats: {
            create: [{}],
          },
        },
        select: {
          id: true,
          name: true,
          colNumber: true,
          rowNumber: true,
          positionColNumber: true,
          positionRowNumber: true,
          spaceType: true,
          version: true,
        },
      });
      return newSpace;
    }
    if (spaceType === spaceTypeMap.pillar) {
      const newSpace = await prisma.spaces.create({
        data: {
          zoneId,
          name: name ? name : '',
          spaceType,
          version,
          colNumber,
          rowNumber,
          positionColNumber,
          positionRowNumber,
          pillars: {
            create: [{}],
          },
        },
        select: {
          id: true,
          name: true,
          colNumber: true,
          rowNumber: true,
          positionColNumber: true,
          positionRowNumber: true,
          spaceType: true,
          version: true,
        },
      });
      return newSpace;
    }
    if (spaceType === spaceTypeMap.group) {
      const newSpace = await prisma.spaces.create({
        data: {
          zoneId,
          name: name ? name : '',
          spaceType,
          version,
          colNumber,
          rowNumber,
          positionColNumber,
          positionRowNumber,
          groups: {
            create: [{}],
          },
        },
        select: {
          id: true,
          name: true,
          colNumber: true,
          rowNumber: true,
          positionColNumber: true,
          positionRowNumber: true,
          spaceType: true,
          version: true,
        },
      });
      return newSpace;
    }
    if (spaceType === spaceTypeMap.aisle) {
      const newSpace = await prisma.spaces.create({
        data: {
          zoneId,
          name: name ? name : '',
          spaceType,
          version,
          colNumber,
          rowNumber,
          positionColNumber,
          positionRowNumber,
          aisles: {
            create: [{}],
          },
        },
        select: {
          id: true,
          name: true,
          colNumber: true,
          rowNumber: true,
          positionColNumber: true,
          positionRowNumber: true,
          spaceType: true,
          version: true,
        },
      });
      return newSpace;
    }
  }
  async findOrCreateSpace(
    zoneId,
    spaceType,
    version,
    colNumber,
    rowNumber,
    name,
    positionColNumber,
    positionRowNumber
  ) {
    if (spaceType === spaceTypeMap.seat) {
      const space = await prisma.spaces.upsert({
        where: {
          zoneId_version_positionColNumber_positionRowNumber: {
            zoneId,
            version,
            positionColNumber,
            positionRowNumber,
          },
        },
        update: {},
        create: {
          zoneId,
          name,
          spaceType,
          version,
          colNumber,
          rowNumber,
          positionColNumber,
          positionRowNumber,
          seats: {
            create: [{}],
          },
        },
        select: {
          id: true,
          name: true,
          colNumber: true,
          rowNumber: true,
          positionColNumber: true,
          positionRowNumber: true,
          spaceType: true,
          version: true,
        },
      });
      return space;
    }
    if (spaceType === spaceTypeMap.pillar) {
      const space = await prisma.spaces.upsert({
        where: {
          zoneId_version_positionColNumber_positionRowNumber: {
            zoneId,
            version,
            positionColNumber,
            positionRowNumber,
          },
        },
        update: {},
        create: {
          zoneId,
          name,
          spaceType,
          version,
          colNumber,
          rowNumber,
          positionColNumber,
          positionRowNumber,
          pillars: {
            create: [{}],
          },
        },
        select: {
          id: true,
          name: true,
          colNumber: true,
          rowNumber: true,
          positionColNumber: true,
          positionRowNumber: true,
          spaceType: true,
          version: true,
        },
      });
      return space;
    }
    if (spaceType === spaceTypeMap.group) {
      const space = await prisma.spaces.upsert({
        where: {
          zoneId_version_positionColNumber_positionRowNumber: {
            zoneId,
            version,
            positionColNumber,
            positionRowNumber,
          },
        },
        update: {},
        create: {
          zoneId,
          name,
          spaceType,
          version,
          colNumber,
          rowNumber,
          positionColNumber,
          positionRowNumber,
          groups: {
            create: [{}],
          },
        },
        select: {
          id: true,
          name: true,
          colNumber: true,
          rowNumber: true,
          positionColNumber: true,
          positionRowNumber: true,
          spaceType: true,
          version: true,
        },
      });
      return space;
    }
    if (spaceType === spaceTypeMap.aisle) {
      const space = await prisma.spaces.upsert({
        where: {
          zoneId_version_positionColNumber_positionRowNumber: {
            zoneId,
            version,
            positionColNumber,
            positionRowNumber,
          },
        },
        update: {},
        create: {
          zoneId,
          name,
          spaceType,
          version,
          colNumber,
          rowNumber,
          positionColNumber,
          positionRowNumber,
          aisles: {
            create: [{}],
          },
        },
        select: {
          id: true,
          name: true,
          colNumber: true,
          rowNumber: true,
          positionColNumber: true,
          positionRowNumber: true,
          spaceType: true,
          version: true,
        },
      });
      return space;
    }
  }
  async getSpacesByZone(zoneId) {
    const spaces = await prisma.spaces.findMany({
      where: {
        zoneId: Number(zoneId),
      },
      select: {
        id: true,
        name: true,
        zoneId: true,
        spaceType: true,
        version: true,
        colNumber: true,
        rowNumber: true,
        positionColNumber: true,
        positionRowNumber: true,
      },
    });
    return spaces;
  }
  async getSpacesByZoneAndSpaceTypes(zoneId, spaceType) {
    const spaceTypeFilter = spaceType.map((type) => {
      return {
        spaceType: type,
      };
    });

    // find
    const spaces = await prisma.spaces.findMany({
      where: {
        zoneId: Number(zoneId),
        OR: spaceTypeFilter,
      },
      select: {
        id: true,
        name: true,
        zoneId: true,
        spaceType: true,
        version: true,
        colNumber: true,
        rowNumber: true,
        positionColNumber: true,
        positionRowNumber: true,
      },
    });
    return spaces;
  }
  async _truncate() {
    await prisma.spaces.deleteMany({});
  }
}

module.exports = SpaceModel;
