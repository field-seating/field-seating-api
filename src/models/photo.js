const { isEmpty } = require('ramda');
const prisma = require('../config/prisma');
const { Prisma } = require('prisma/prisma-client');
const { usefulMap } = require('../models/review/constant');
const { orderMap } = require('../services/space-service/constant');

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
    WHERE Reviews.photoId IN (select Photos.id FROM Photos where Photos.spaceId = ${spaceId})
    group by photoId
    ORDER BY netUsefulCount desc `;

    return photosWithReviewCount;
  }
  async getPhotosBySpace(
    spaceId,
    order = 'desc',
    { limit, cursorId = null } = {}
  ) {
    // have cursorId
    if (cursorId) {
      const photos = await prisma.photos.findMany({
        where: {
          spaceId: Number(spaceId),
        },
        skip: 1,
        take: limit,
        cursor: {
          id: Number(cursorId),
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
          date: order,
        },
      });
      const result = {
        data: photos,
        cursorId: isEmpty(photos) ? null : photos[photos.length - 1].id,
      };
      return result;
    }

    // no cursorId
    const photos = await prisma.photos.findMany({
      where: {
        spaceId: Number(spaceId),
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
      cursorId: isEmpty(photos) ? null : photos[photos.length - 1].id,
    };
    return result;
  }
  async getOtherPhotosBySpace(
    spaceId,
    photoId,
    { limit, cursorId = null } = {}
  ) {
    // if has cursor
    if (cursorId) {
      const photos = await prisma.photos.findMany({
        where: {
          id: { not: Number(photoId) },
          spaceId: Number(spaceId),
        },
        skip: 1, // prisma set
        take: limit,
        cursor: {
          id: Number(cursorId),
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
        cursorId: isEmpty(photos) ? null : photos[photos.length - 1].id,
      };
      return result;
    }

    const photos = await prisma.photos.findMany({
      take: limit,
      where: {
        id: { not: Number(photoId) },
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

    const result = {
      data: photos,
      // to combine start photo we need catch (length -2) index
      cursorId: isEmpty(photos) ? null : photos[photos.length - 2].id,
    };
    return result;
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
  async getPhotos({ limit, cursorId = null } = {}, order = orderMap.desc) {
    // have cursorId
    if (cursorId) {
      const photos = await prisma.photos.findMany({
        where: {},
        skip: 1,
        take: limit,
        cursor: {
          id: Number(cursorId),
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
          date: order,
        },
      });

      const result = {
        data: photos,
        cursorId: isEmpty(photos) ? null : photos[photos.length - 1].id,
      };
      return result;
    }

    // no cursorId
    const photos = await prisma.photos.findMany({
      where: {},
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
        date: 'desc',
      },
    });

    const result = {
      data: photos,
      cursorId: isEmpty(photos) ? null : photos[photos.length - 1].id,
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
  async _truncate() {
    await prisma.photos.deleteMany({});
  }
}

module.exports = PhotoModel;
