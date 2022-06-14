const resSuccess = require('./helpers/response');
const SpacesByZoneCache = require('../cache/spaces');

const zoneController = {
  getZoneSpaces: async (req, res, next) => {
    try {
      const zoneId = req.params.id;
      const querySpaceType = req.query.spaceType;
      const spaceType = querySpaceType ? [].concat(querySpaceType) : null;
      const spacesByZoneCache = new SpacesByZoneCache({ logger: req.logger });
      const spaces = await spacesByZoneCache.get(zoneId, spaceType);
      res.status(200).json(resSuccess(spaces));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = zoneController;
