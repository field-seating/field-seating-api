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
  async _truncate() {
    await prisma.orientations.deleteMany({});
  }
}

module.exports = OrientationModel;
