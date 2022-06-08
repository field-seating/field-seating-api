const ZoneService = require('../services/zone-service');
const resSuccess = require('./helpers/response');

const zoneController = {
  getSpacesByZone: async (req, res, next) => {
    try {
      const zoneId = req.params.id;
      const queryData = req.query.spaceType;
      let spaceType = undefined;
      if (!queryData) {
        spaceType = null;
      } else {
        spaceType = [].concat(queryData);
      }
      const zoneService = new ZoneService({ logger: req.logger });
      const spaces = await zoneService.getSpacesByZone(zoneId, spaceType);
      res.status(200).json(resSuccess(spaces));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = zoneController;
