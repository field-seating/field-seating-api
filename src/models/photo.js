const prisma = require('../config/prisma');

class PhotoModel {
  constructor() {}
  // get latest photo_pathname
  async createPhoto(filename, userId, spaceId, dateTime) {
    const createPhoto = await prisma.photos.create({
      data: {
        userId: userId,
        spaceId: spaceId,
        date: dateTime,
        path: filename,
        thumbnail_path: `thumb_${filename}`,
      },
      select: {
        id: true,
        spaceId: true,
        path: true,
      },
    });
    return createPhoto;
  }
}

module.exports = PhotoModel;
