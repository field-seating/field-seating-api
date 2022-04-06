const prisma = require('../config/prisma');

class PhotoModel {
  constructor() {}
  // get latest photo_pathname
  async getLatestPhoto(spaceId) {
    const getLatestPhoto = await prisma.photos.findMany({
      where: {
        spaceId: spaceId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
      select: {
        id: true,
        path: true,
        thumbnail_path: true,
        spaceId: true,
      },
    });
    return getLatestPhoto[0];
  }
}

module.exports = PhotoModel;
