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
  async getOrientationsByField() {
    const fieldList = await prisma.orientations.findMany({
      where: {},
      select: {
        id: true,
        name: true,
        img: true,
      },
    });
    return fieldList;
  }
  async _truncate() {
    await prisma.orientations.deleteMany({});
  }
}

module.exports = OrientationModel;
