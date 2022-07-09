const { isNil } = require('ramda');
const SpaceService = require('../services/space-service');
const resSuccess = require('./helpers/response');
const { paginationLimitMap } = require('../constants/pagination-constant');

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
      const cursorId = req.query.cursor_id;
      const paginationOption = {
        limit: limit ? Number(limit) : paginationLimitMap.photos,
        cursorId: cursorId ? Number(cursorId) : null,
      };

      const spaceService = new SpaceService({ logger: req.logger });

      // check space exist
      const space = await spaceService.getSpace(id);
      const spaceNotExist = isNil(space);
      let result = null;

      // exist then get photos by space
      if (!spaceNotExist) {
        result = await spaceService.getPhotosBySpace(
          id,
          sort,
          order,
          paginationOption
        );
      }
      res.status(200).json(resSuccess(spaceNotExist ? space : result));
    } catch (err) {
      next(err);
    }
  },
};
module.exports = spaceController;
