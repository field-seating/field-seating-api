const { isNil } = require('ramda');
const SpaceService = require('../services/space-service');
const resSuccess = require('./helpers/response');
const {
  paginationLimitMap,
  orderMap,
  sortMap,
} = require('../constants/pagination-constant');

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
      const limit = req.query.limit;
      const paginationOption = {
        sort: sort ? sort : sortMap.date,
        order: order ? order : orderMap.desc,
        limit: limit ? Number(limit) : paginationLimitMap.photos,
        cursorId: null,
      };

      const spaceService = new SpaceService({ logger: req.logger });

      // check space exist
      const space = await spaceService.getSpace(id);

      if (isNil(space)) {
        // if space not existed
        res.status(200).json(resSuccess(space));
        next();
      } else {
        // exist then get photos by space
        const result = await spaceService.getPhotosBySpace(
          id,
          paginationOption
        );
        res.status(200).json(resSuccess(result));
      }
    } catch (err) {
      next(err);
    }
  },
};
module.exports = spaceController;
