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
  async searchOrientation(name) {
    const searchOrientation = await prisma.orientations.findUnique({
      where: {
        name: name,
      },
      select: {
        id: true,
      },
    });
    return searchOrientation;
  }
  async _truncate() {
    await prisma.orientations.deleteMany({});
  }
}

module.exports = OrientationModel;
