const prisma = require('../config/prisma');

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
            field: {
              id: fieldId,
            },
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
