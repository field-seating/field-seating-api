const BaseService = require('./base');
const SpaceModel = require('../models/space');

class ZoneService extends BaseService {
  async getZoneSpaces(zoneId, spaceType) {
    const spaceModel = new SpaceModel();
    const spaces = await spaceModel.getZoneSpaces(zoneId, spaceType);
    return spaces;
  }
}

module.exports = ZoneService;
