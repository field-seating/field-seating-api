const prisma = require('../config/prisma');
const { usefulMap } = require('../models/review/constant');

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
  async getPhotosReviewCountBySpace(spaceId) {
    const photosWithReviewCount = await prisma.$queryRaw`SELECT
    Reviews.photoId,
    COUNT(if(Reviews.useful=${usefulMap.up},true,null)) AS usefulCount, 
    COUNT(if(Reviews.useful=${usefulMap.down},true,null)) AS uselessCount,
    COUNT(if(Reviews.useful=${usefulMap.up},true,null)) - COUNT(if(Reviews.useful=${usefulMap.down},true,null))  AS netUsefulCount
    FROM Reviews
    WHERE Reviews.photoId IN (select Photos.id FROM Photos where Photos.spaceId = ${spaceId})
    group by photoId
    ORDER BY netUsefulCount desc `;

    return photosWithReviewCount;
  }
  async getPhotosBySpace(spaceId, order) {
    const photos = await prisma.photos.findMany({
      where: {
        spaceId: Number(spaceId),
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        spaceId: true,
        date: true,
        path: true,
      },
      orderBy: {
        date: order ? order : 'desc',
      },
    });
    return photos;
  }
  async getOtherPhotosBySpace(spaceId, photoId) {
    const photos = await prisma.photos.findMany({
      where: {
        id: { not: photoId },
        spaceId: Number(spaceId),
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        spaceId: true,
        date: true,
        path: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
    return photos;
  }
  async getPhoto(id) {
    const photo = await prisma.photos.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
          },
        },
        spaceId: true,
        date: true,
        path: true,
      },
    });
    return photo;
  }
  async _truncate() {
    await prisma.spaces.deleteMany({});
  }
}

module.exports = PhotoModel;
