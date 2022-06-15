const { isNil } = require('ramda');
const BaseService = require('./base');
const SpaceModel = require('../models/space');
const GeneralError = require('../errors/error/general-error');
const getDataErrorMap = require('../errors/get-data-error');

class SpaceService extends BaseService {
  async getSpace(id) {
    const zoneModel = new SpaceModel();

    const space = await zoneModel.getSpace(id);
    if (isNil(space)) throw new GeneralError(getDataErrorMap['spaceNotFound']);

    this.logger.debug('got a space', { space });
    return space;
  }
}

module.exports = SpaceService;
