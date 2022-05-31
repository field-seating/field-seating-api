const prisma = require('../config/prisma');

class PhotoModel {
  constructor() {}
  async createPhoto(path, userId, spaceId, dateTime) {
    const newPhoto = await prisma.photos.create({
      data: {
        userId: userId,
        spaceId: spaceId,
        date: dateTime,
        path: path,
      },
      select: {
        id: true,
        spaceId: true,
        path: true,
      },
    });
    return newPhoto;
  }
  async _truncate() {
    await prisma.photos.deleteMany({});
  }
}

module.exports = PhotoModel;
