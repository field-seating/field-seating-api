const BaseService = require('./base');
const ReviewModel = require('../models/review/review');
const PhotoModel = require('../models/photo');

const GeneralError = require('../errors/error/general-error');
const getPhotoErrorMap = require('../errors/get-photo-error');

class ReviewService extends BaseService {
  async createReview(userId, photoId, useful) {
    // check space exist
    const photoModel = new PhotoModel();
    const photoCheck = await photoModel.getPhoto(photoId);
    if (!photoCheck) throw new GeneralError(getPhotoErrorMap['photoNotFound']);

    const reviewModel = new ReviewModel();
    const newReview = await reviewModel.createReview(userId, photoId, useful);

    this.logger.debug('got a field', { newReview });

    return newReview;
  }
}

module.exports = ReviewService;
