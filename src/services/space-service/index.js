const { isNil } = require('ramda');
const BaseService = require('../base');
const SpaceModel = require('../../models/space');
const PhotoModel = require('../../models/photo');
const GeneralError = require('../../errors/error/general-error');
const getDataErrorMap = require('../../errors/get-data-error');
const { sortMap } = require('./constant');

class SpaceService extends BaseService {
  async getSpace(id) {
    const spaceModel = new SpaceModel();

    const space = await spaceModel.getSpace(id);

    if (isNil(space)) throw new GeneralError(getDataErrorMap['spaceNotFound']);

    this.logger.debug('got a space', { space });

    return space;
  }
  async getPhotosBySpace(id, sort, order) {
    const photoModel = new PhotoModel();
    let photos = '';
    if (sort === sortMap.useful) {
      photos = await photoModel.getPhotosBySpaceOrderByUseful(id, sort, order);
    } else {
      photos = await photoModel.getPhotosBySpaceOrderByCreateAt(
        id,
        sort,
        order
      );
    }

    this.logger.debug('got photos', { photos });

    return photos;
  }
}

module.exports = SpaceService;
