const resSuccess = require('./helpers/response');
const SpacesCache = require('../cache/spaces');

const zoneController = {
  getZoneSpaces: async (req, res, next) => {
    try {
      const zoneId = req.params.id;
      const querySpaceType = req.query.spaceType;
      const spaceType = querySpaceType ? [].concat(querySpaceType) : null;
      const zonesCache = new SpacesCache({ logger: req.logger });
      const spaces = await zonesCache.get(zoneId, spaceType);
      res.status(200).json(resSuccess(spaces));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = zoneController;
