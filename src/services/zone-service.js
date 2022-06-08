const BaseService = require('./base');
const SpaceModel = require('../models/space');
const GeneralError = require('../errors/error/general-error');
const getListErrorMap = require('../errors/getList-error');

class ZoneService extends BaseService {
  async getSpacesByZone(zoneId, spaceType) {
    const spaceModel = new SpaceModel();
    let spaces = [];
    if (!spaceType) {
      spaces = await spaceModel.getSpacesByZone(zoneId);
    }
    if (spaceType) {
      spaces = await spaceModel.getSpacesByZoneAndSpaceTypes(zoneId, spaceType);
    }
    if (!spaces[0]) throw new GeneralError(getListErrorMap['zoneNotFound']);

    // demo for local logger
    this.logger.debug('got a SpaceList', { spaces });
    return spaces;
  }
}

module.exports = ZoneService;
