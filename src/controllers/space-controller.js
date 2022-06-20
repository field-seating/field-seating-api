const SpaceService = require('../services/space-service');
const resSuccess = require('./helpers/response');

const spaceController = {
  getSpace: async (req, res, next) => {
    try {
      const id = req.params.id;
      const spaceService = new SpaceService({ logger: req.logger });
      const space = await spaceService.getSpace(id);
      res.status(200).json(resSuccess(space));
    } catch (err) {
      next(err);
    }
  },
  getSpacePhotos: async (req, res, next) => {
    try {
      const id = req.params.id;
      const sort = req.query.sort;
      const order = req.query.order;
      const spaceService = new SpaceService({ logger: req.logger });
      const photos = await spaceService.getPhotosBySpace(id, sort, order);
      res.status(200).json(resSuccess(photos));
    } catch (err) {
      next(err);
    }
  },
};
module.exports = spaceController;
