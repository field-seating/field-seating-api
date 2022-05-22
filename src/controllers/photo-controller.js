const PhotoService = require('../services/photo-service');
const resSuccess = require('./helpers/response');
const getUser = require('./helpers/get-user');

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
};

module.exports = photoController;
