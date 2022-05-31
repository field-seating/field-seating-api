const prisma = require('../config/prisma');

class OrientationModel {
  constructor() {}
  async createOrientation(name) {
    const createOrientation = await prisma.orientations.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
      },
    });
    return createOrientation;
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
