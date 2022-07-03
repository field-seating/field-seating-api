const PhotoService = require('../services/photo-service');
const ReviewService = require('../services/review-service');

const resSuccess = require('./helpers/response');
const getUser = require('./helpers/get-user');
const SpaceService = require('../services/space-service');
const { isNil } = require('ramda');

const photoController = {
  postPhotos: async (req, res, next) => {
    try {
      const { spaceId, date } = req.body;
      const userId = getUser(req).id;

      const photoService = new PhotoService({ logger: req.logger });
      const uploadInfo = await photoService.postPhotos(
        spaceId,
        req.files,
        req.requestId,
        userId,
        date
      );
      res.status(200).json(resSuccess(uploadInfo));
    } catch (err) {
      next(err);
    }
  },
  getPhotos: async (req, res, next) => {
    try {
      const photoId = req.query.start_photo;

      // if no query
      if (isNil(photoId)) {
        const photoService = new PhotoService({ logger: req.logger });
        const photos = await photoService.getPhotos();
        res.status(200).json(resSuccess(photos));
      }

      // get target photo
      const photoService = new PhotoService({ logger: req.logger });
      const startPhoto = await photoService.getPhoto(photoId);

      // get other photos
      const spaceService = new SpaceService({ logger: req.logger });
      const photos = await spaceService.getOtherPhotosBySpace(
        startPhoto.spaceId,
        startPhoto.id
      );

      photos.unshift(startPhoto);
      res.status(200).json(resSuccess(photos));
    } catch (err) {
      next(err);
    }
  },
  postReview: async (req, res, next) => {
    try {
      const { useful } = req.body;
      const userId = getUser(req).id;
      const photoId = req.params.id;

      const reviewService = new ReviewService({ logger: req.logger });
      const review = await reviewService.postReview(userId, photoId, useful);
      res.status(200).json(resSuccess(review));
    } catch (err) {
      next(err);
    }
  },
  postUnreview: async (req, res, next) => {
    try {
      const { useful } = req.body;
      const userId = getUser(req).id;
      const photoId = req.params.id;

      const reviewService = new ReviewService({ logger: req.logger });
      const review = await reviewService.postUnreview(userId, photoId, useful);
      res.status(200).json(resSuccess(review));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = photoController;
