const prisma = require('../../config/prisma');
const { usefulMap } = require('./constant');

class ReviewModel {
  async createReview(userId, photoId, useful) {
    const newReview = await prisma.reviews.create({
      data: {
        userId: Number(userId),
        photoId: Number(photoId),
        useful,
      },
      select: {
        id: true,
        userId: true,
        photoId: true,
        useful: true,
      },
    });
    return newReview;
  }
  async getReviewCountByPhoto(photoId) {
    const photoWithReviewCount = await prisma.$queryRaw`SELECT
    Reviews.photoId,
    COUNT(if(Reviews.useful=${usefulMap.up},true,null)) AS usefulCount, 
    COUNT(if(Reviews.useful=${usefulMap.down},true,null)) AS uselessCount,
    COUNT(if(Reviews.useful=${usefulMap.up},true,null)) - COUNT(if(Reviews.useful=${usefulMap.down},true,null))  AS netUsefulCount
    FROM Reviews
    WHERE Reviews.photoId  = ${photoId}
    group by Reviews.photoId`;

    return photoWithReviewCount;
  }
  async _truncate() {
    await prisma.reviews.deleteMany({});
  }
}

module.exports = ReviewModel;
