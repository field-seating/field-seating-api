const PhotoService = require('../services/photo-service');
const resSuccess = require('./helpers/response');
const getUser = require('./helpers/get-user');
const { paginationLimitMap } = require('../constants/pagination-constant');

const photoController = {
  postPhotos: async (req, res, next) => {
    try {
      const { spaceId, date } = req.body;
      const userId = getUser(req) ? getUser(req).id : null;

      const photoService = new PhotoService({ logger: req.logger });
      const uploadInfo = await photoService.postPhotos(
        spaceId,
        req.files,
        req.requestId,
        date,
        userId
      );

      res.status(200).json(resSuccess(uploadInfo));
    } catch (err) {
      next(err);
    }
  },
  getPhotos: async (req, res, next) => {
    try {
      const startPhotoId = req.query.start_photo;
      const limit = req.query.limit;
      const paginationOption = {
        limit: limit ? Number(limit) : paginationLimitMap.photos,
        cursorId: null,
      };

      // get target photo
      const photoService = new PhotoService({ logger: req.logger });
      const result = await photoService.getPhotos(
        startPhotoId,
        paginationOption
      );

      res.status(200).json(resSuccess(result));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = photoController;
