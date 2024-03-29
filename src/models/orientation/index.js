const prisma = require('../../config/prisma');

class OrientationModel {
  constructor() {}
  async createOrientation(name) {
    const newOrientation = await prisma.orientations.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return newOrientation;
  }
  async findOrCreateOrientation(name) {
    const orientation = await prisma.orientations.upsert({
      where: { name },
      update: {},
      create: { name },
      select: {
        id: true,
        name: true,
      },
    });
    return orientation;
  }
  async getOrientationByName(name) {
    const orientation = await prisma.orientations.findUnique({
      where: {
        name: name,
      },
      select: {
        id: true,
      },
    });
    return orientation;
  }
  async getOrientationsByField(fieldId) {
    const orientationList = await prisma.orientations.findMany({
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
    return orientationList;
  }
  async _truncate() {
    await prisma.orientations.deleteMany({});
  }
}

module.exports = OrientationModel;
