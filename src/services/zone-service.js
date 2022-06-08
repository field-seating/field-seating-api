const BaseService = require('./base');
const SpaceModel = require('../models/space');
const GeneralError = require('../errors/error/general-error');
const getListErrorMap = require('../errors/getList-error');

class ZoneService extends BaseService {
  async getZoneSpaces(zoneId, spaceType) {
    const spaceModel = new SpaceModel();
    const spaces = await spaceModel.getZoneSpaces(zoneId, spaceType);
    if (!spaces[0]) throw new GeneralError(getListErrorMap['zoneNotFound']);
    return spaces;
  }
}

module.exports = ZoneService;
