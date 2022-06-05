const ZoneService = require('../services/zone-service');
const resSuccess = require('./helpers/response');

const zoneController = {
  getZoneSpaces: async (req, res, next) => {
    try {
      const zoneId = req.params.id;
      const spaceType = req.query.spaceType;
      const zoneService = new ZoneService({ logger: req.logger });
      const spaces = await zoneService.getZoneSpaces(zoneId, spaceType);
      res.status(200).json(resSuccess(spaces));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = zoneController;
