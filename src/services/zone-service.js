const { isNil } = require('ramda');
const BaseService = require('./base');
const SpaceModel = require('../models/space');
const ZoneModel = require('../models/zone');
const GeneralError = require('../errors/error/general-error');
const getListErrorMap = require('../errors/get-list-error');
const getDataErrorMap = require('../errors/get-data-error');

class ZoneService extends BaseService {
  async getSpacesByZone(zoneId, spaceType) {
    const spaceModel = new SpaceModel();

    async function getSpaces(spaceType) {
      if (!spaceType) {
        const spaces = await spaceModel.getSpacesByZone(zoneId);
        return spaces;
      }
      return await spaceModel.getSpacesByZoneAndSpaceTypes(zoneId, spaceType);
    }

    const spaces = await getSpaces(spaceType);

    if (spaces.length === 0)
      throw new GeneralError(getListErrorMap['spacesNotFound']);

    this.logger.debug('got a SpaceList', { spaces });

    return spaces;
  }
  async getZone(id) {
    const zoneModel = new ZoneModel();

    const zone = await zoneModel.getZone(id);

    if (isNil(zone)) throw new GeneralError(getDataErrorMap['zoneNotFound']);

    this.logger.debug('got a zone', { zone });

    return zone;
  }
}

module.exports = ZoneService;
