const { isEmpty, isNil } = require('ramda');
const BaseService = require('./base');
const ReviewModel = require('../models/review/index');
const PhotoModel = require('../models/photo');

const GeneralError = require('../errors/error/general-error');
const getPhotoErrorMap = require('../errors/get-photo-error');
const reviewErrorMap = require('../errors//review-error');

class ReviewService extends BaseService {
  async postReview(userId, photoId, useful) {
    // check space exist
    const photoModel = new PhotoModel();
    const photoCheck = await photoModel.getPhoto(photoId);
    if (!photoCheck) throw new GeneralError(getPhotoErrorMap['photoNotFound']);

    // check existed review
    const reviewModel = new ReviewModel();
    const review = await reviewModel.getReview(userId, photoId);

    // if already review (not cancel)
    if (review && !isEmpty(review.useful))
      throw new GeneralError(reviewErrorMap['alreadyReview']);

    // if already review but cancel
    if (review && isEmpty(review.useful)) {
      const updateReview = await reviewModel.updateReview(
        userId,
        photoId,
        useful
      );

      this.logger.debug('update a review', { updateReview });

      return updateReview;
    }

    // if review not exist
    const newReview = await reviewModel.createReview(userId, photoId, useful);

    this.logger.debug('create a review', { newReview });

    return newReview;
  }
  async postUnreview(userId, photoId, useful) {
    // check space exist
    const photoModel = new PhotoModel();
    const photoCheck = await photoModel.getPhoto(photoId);
    if (!photoCheck) throw new GeneralError(getPhotoErrorMap['photoNotFound']);

    // check existed review
    const reviewModel = new ReviewModel();
    const review = await reviewModel.getReview(userId, photoId);

    // if review not existed
    if (isNil(review)) throw new GeneralError(reviewErrorMap['notReviewYet']);

    // if review already be canceled
    if (review && isEmpty(review.useful))
      throw new GeneralError(reviewErrorMap['alreadyUnReview']);

    // if unreview's useful not equal reviewed before
    if (review && useful !== review.useful)
      throw new GeneralError(reviewErrorMap['badUnReviewRequest']);

    const unReview = await reviewModel.updateReview(userId, photoId, '');

    this.logger.debug('update a review', { unReview });

    return unReview;
  }
}

module.exports = ReviewService;
