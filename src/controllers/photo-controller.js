const PhotoService = require('../services/photo-service');
const resSuccess = require('./helpers/response');
const getUser = require('./helpers/get-user');
const SpaceService = require('../services/space-service');
const ReviewService = require('../services/review-service');

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
  getPhotosPhotos: async (req, res, next) => {
    try {
      const photoId = req.query.start_photo;
      const photoService = new PhotoService({ logger: req.logger });
      const startPhoto = await photoService.getPhoto(photoId);
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
      const uploadInfo = await reviewService.postReview(
        userId,
        photoId,
        useful
      );
      res.status(200).json(resSuccess(uploadInfo));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = photoController;
