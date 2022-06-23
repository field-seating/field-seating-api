const ReviewService = require('../services/review-service');
const resSuccess = require('./helpers/response');
const getUser = require('./helpers/get-user');

const reviewController = {
  postPhotos: async (req, res, next) => {
    try {
      const { spaceId, date } = req.body;
      const userId = getUser(req).id;

      const photoService = new ReviewService({ logger: req.logger });
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
      const id = req.params.id;
      const sort = req.query.sort;
      const order = req.query.order;
      const spaceService = new ReviewService({ logger: req.logger });
      const photos = await spaceService.getPhotosBySpace(id, sort, order);
      res.status(200).json(resSuccess(photos));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = reviewController;
