const prisma = require('../config/prisma');

class FieldModel {
  constructor() {}
  async createField(name, img, orientationIds, levelIds) {
    let orientationConnect = [];
    let levelConnect = [];
    // create prisma code array
    if (orientationIds) {
      orientationConnect = await Promise.all(
        orientationIds.map(async (id) => {
          return {
            orientation: {
              connect: {
                id: id,
              },
            },
          };
        })
      );
    }

    // create prisma code array
    if (levelIds) {
      levelConnect = await Promise.all(
        levelIds.map(async (id) => {
          return {
            level: {
              connect: {
                id: id,
              },
            },
          };
        })
      );
    }

    // create
    const newField = await prisma.fields.create({
      data: {
        name,
        img,
        levels: {
          create: levelConnect,
        },
        orientations: {
          create: orientationConnect,
        },
      },
      select: {
        id: true,
        name: true,
        img: true,
      },
    });
    return newField;
  }
  async getFieldByName(name) {
    const field = await prisma.fields.findUnique({
      where: {
        name: name,
      },
      select: {
        id: true,
      },
    });
    return field;
  }
  async _truncate() {
    await prisma.fields.deleteMany({});
  }
}

module.exports = FieldModel;
