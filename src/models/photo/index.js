const prisma = require('../../config/prisma');
const { Prisma } = require('prisma/prisma-client');
const { usefulMap } = require('../review/constant');
const { orderMap } = require('../../services/space-service/constant');

class PhotoModel {
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
    WHERE Reviews.photoId IN (select Photos.id FROM Photos where Photos.spaceId = ${spaceId} AND Photos.isDeleted = 0)
    group by photoId
    ORDER BY netUsefulCount desc `;

    return photosWithReviewCount;
  }
  async getPhotosBySpace(spaceId, { order = 'desc', limit } = {}) {
    const photos = await prisma.photos.findMany({
      where: {
        spaceId: Number(spaceId),
        isDeleted: 0,
      },
      take: limit,
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
        date: order,
      },
    });

    const result = {
      data: photos,
      cursorId: null,
    };
    return result;
  }
  async getOtherPhotosBySpace(spaceId, photoId, { limit } = {}) {
    const photos = await prisma.photos.findMany({
      take: limit,
      where: {
        id: { not: Number(photoId) },
        spaceId: Number(spaceId),
        isDeleted: 0,
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

    const result = {
      data: photos,
      cursorId: null,
    };
    return result;
  }
  async getPhoto(id) {
    const photo = await prisma.photos.findMany({
      where: {
        id: Number(id),
        isDeleted: 0,
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
  async getPhotos({ limit } = {}, order = orderMap.desc) {
    const photos = await prisma.photos.findMany({
      where: {
        isDeleted: 0,
      },
      take: limit,
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
      orderBy: { date: order },
    });

    const result = {
      data: photos,
      cursorId: null,
    };
    return result;
  }
  async getPhotosReviewCount(photosIds) {
    const photosWithReviewCount = await prisma.$queryRaw`SELECT
    Reviews.photoId,
    COUNT(if(Reviews.useful=${usefulMap.up},true,null)) AS usefulCount, 
    COUNT(if(Reviews.useful=${usefulMap.down},true,null)) AS uselessCount,
    COUNT(if(Reviews.useful=${
      usefulMap.up
    },true,null)) - COUNT(if(Reviews.useful=${
      usefulMap.down
    },true,null))  AS netUsefulCount
    FROM Reviews
    WHERE Reviews.photoId IN (${Prisma.join(photosIds)})
    group by photoId
    ORDER BY netUsefulCount desc `;

    return photosWithReviewCount;
  }
  async deletePhoto(photoId) {
    const deletePhoto = await prisma.photos.update({
      where: { id: photoId },
      data: {
        isDeleted: 1,
        deletedAt: new Date(Date.now()),
      },
      select: {
        id: true,
        userId: true,
        spaceId: true,
        path: true,
        isDeleted: true,
      },
    });
    return deletePhoto;
  }
  async _truncate() {
    await prisma.photos.deleteMany({});
  }
}

module.exports = PhotoModel;
