const prisma = require('../config/prisma');

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
        zone: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    console.log(getSpace);
    return getSpace;
  }
}

module.exports = SpaceModel;
