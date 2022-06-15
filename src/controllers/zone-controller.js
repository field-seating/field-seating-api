const resSuccess = require('./helpers/response');
const SpacesByZoneCache = require('../cache/spaces-by-zone');

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
  getZone: async (req, res, next) => {
    try {
      const id = req.params.id;
      const zoneService = new ZoneService({ logger: req.logger });
      const zone = await zoneService.getZone(id);
      res.status(200).json(resSuccess(zone));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = zoneController;
