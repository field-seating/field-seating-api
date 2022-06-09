const BaseService = require('./base');
const SpaceModel = require('../models/space');
const GeneralError = require('../errors/error/general-error');
const getListErrorMap = require('../errors/getList-error');

class ZoneService extends BaseService {
  async getSpacesByZone(zoneId, spaceType) {
    const spaceModel = new SpaceModel();

    async function getSpacesModelSelector(spaceType) {
      if (!spaceType) {
        const spaces = await spaceModel.getSpacesByZone(zoneId);
        return spaces;
      }
      return await spaceModel.getSpacesByZoneAndSpaceTypes(zoneId, spaceType);
    }

    const spaces = await getSpacesModelSelector(spaceType);
    if (!spaces[0]) throw new GeneralError(getListErrorMap['spaceNotFound']);

    this.logger.debug('got a SpaceList', { spaces });
    return spaces;
  }
}

module.exports = ZoneService;
