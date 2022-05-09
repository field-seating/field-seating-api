const BaseService = require('./base');
const SpaceModel = require('../models/space');

class SpaceService extends BaseService {
  async getSpace(spaceId) {
    spaceId = parseInt(spaceId);
    const spaceModel = new SpaceModel();
    const space = await spaceModel.getSpace(spaceId);
    return space;
  }
}

module.exports = SpaceService;
