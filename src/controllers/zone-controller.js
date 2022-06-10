const ZoneService = require('../services/zone-service');
const resSuccess = require('./helpers/response');

const zoneController = {
  getZoneSpaces: async (req, res, next) => {
    try {
      const zoneId = req.params.id;
      const querySpaceType = req.query.spaceType;
      const spaceType = querySpaceType ? [].concat(querySpaceType) : null;
      const zoneService = new ZoneService({ logger: req.logger });
      const spaces = await zoneService.getSpacesByZone(zoneId, spaceType);
      res.status(200).json(resSuccess(spaces));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = zoneController;
