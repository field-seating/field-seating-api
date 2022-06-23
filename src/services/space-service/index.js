const { isNil } = require('ramda');
const R = require('ramda');
const BaseService = require('../base');
const SpaceModel = require('../../models/space');
const PhotoModel = require('../../models/photo');
const GeneralError = require('../../errors/error/general-error');
const getDataErrorMap = require('../../errors/get-data-error');
const { sortMap, orderMap } = require('./constant');
const { uselessLimit, assetDomain } = require('../../config/config');

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

    // get photos by space which has review
    const photosWithReviewCount = await photoModel.getPhotosReviewCountBySpace(
      id
    );

    // get photos by space
    const photos = await photoModel.getPhotosBySpace(id, order);

    // combine above two data
    let photosData = await Promise.all(
      photos.map(async (photo) => {
        for (let i = 0; i < photosWithReviewCount.length; i++) {
          if (photosWithReviewCount[i].photoId === photo.id) {
            console.log('catch');
            photo = {
              ...photo,
              url: `https://${assetDomain}.com${photo.path}`,
              usefulCount: photosWithReviewCount[i].usefulCount,
              uselessCount: photosWithReviewCount[i].uselessCount,
              netUsefulCount: photosWithReviewCount[i].netUsefulCount,
            };
            photo = R.omit(['path'], photo);
          }
        }
        return photo;
      })
    );

    // sort and order condition
    if (sort === sortMap.useful && order === orderMap.desc) {
      photosData = photosData.sort(
        (a, b) => b.netUsefulCount - a.netUsefulCount
      );

      // delete useless data
      for (let i = photosData.length - 1; i >= 0; i--) {
        if (photosData[i].netUsefulCount < uselessLimit.limit)
          photosData.splice(i, 1);
      }
    }
    if (sort === sortMap.useful && order === orderMap.asc) {
      photosData = photosData.sort(
        (a, b) => a.netUsefulCount - b.netUsefulCount
      );

      // delete useless data
      for (let i = photosData.length - 1; i >= 0; i--) {
        if (photosData[i].netUsefulCount < uselessLimit.limit)
          photosData.splice(i, 1);
      }
    }
    return photosData;
  }
}

module.exports = SpaceService;
