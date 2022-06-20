const prisma = require('../config/prisma');
const { usefulMap } = require('../models/review/constant');

class PhotoModel {
  constructor() {}
  async getPhotosBySpaceOrderByUseful(spaceId) {
    const photosWithReviewCount = await prisma.$queryRaw`SELECT
    Reviews.photoId,
    COUNT(if(Reviews.useful=${usefulMap.up},true,null)) AS usefulCount, 
    COUNT(if(Reviews.useful=${usefulMap.down},true,null)) AS uselessCount,
    COUNT(if(Reviews.useful=${usefulMap.up},true,null)) - COUNT(if(Reviews.useful=${usefulMap.down},true,null))  AS netUsefulCount
    FROM Reviews
    WHERE Reviews.photoId IN (select Photos.id FROM Photos where Photos.spaceId = ${spaceId})
    group by photoId
    ORDER BY netUsefulCount DESC`;

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
    });
    const result = await Promise.all(
      photosWithReviewCount.map(async (photo) => {
        for (let i = 0; i < photos.length; i++) {
          if (photos[i].id === photo.photoId) {
            photo = {
              id: photos[i].id,
              user: {
                id: photos[i].user.id,
                name: photos[i].user.name,
              },
              spaceId: photos[i].spaceId,
              date: photos[i].date,
              path: photos[i].path,
              ...photo,
            };
          }
        }
        return photo;
      })
    );
    return result;
  }
  async getPhotosBySpaceOrderByCreateAt(spaceId) {
    const photosWithReviewCount = await prisma.$queryRaw`SELECT
    Reviews.photoId,
    COUNT(if(Reviews.useful=${usefulMap.up},true,null)) AS usefulCount, 
    COUNT(if(Reviews.useful=${usefulMap.down},true,null)) AS uselessCount,
    COUNT(if(Reviews.useful=${usefulMap.up},true,null)) - COUNT(if(Reviews.useful=${usefulMap.down},true,null))  AS netUsefulCount
    FROM Reviews
    WHERE Reviews.photoId IN (select Photos.id FROM Photos where Photos.spaceId = ${spaceId})
    group by photoId
    ORDER BY netUsefulCount DESC`;

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
        date: 'asc',
      },
    });
    const result = await Promise.all(
      photos.map(async (photo) => {
        for (let i = 0; i < photosWithReviewCount.length; i++) {
          if (photosWithReviewCount[i].photoId === photo.id) {
            console.log('catch');
            photo = {
              ...photo,
              usefulCount: photosWithReviewCount[i].usefulCount,
              uselessCount: photosWithReviewCount[i].uselessCount,
              netUsefulCount: photosWithReviewCount[i].netUsefulCount,
            };
          }
        }
        return photo;
      })
    );
    return result;
  }
  async _truncate() {
    await prisma.spaces.deleteMany({});
  }
}

module.exports = PhotoModel;
