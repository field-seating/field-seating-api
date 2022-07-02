const { isNil } = require('ramda');
const R = require('ramda');
const BaseService = require('../base');
const SpaceModel = require('../../models/space');
const PhotoModel = require('../../models/photo');
const GeneralError = require('../../errors/error/general-error');
const getDataErrorMap = require('../../errors/get-data-error');
const getPhotoErrorMap = require('../../errors/get-photo-error');
const { sortMap, orderMap } = require('./constant');
const { bucketMap } = require('../../constants/upload-constant');
const { sizeMap } = require('../../constants/resize-constant');
const { uselessLimit, assetDomain } = require('../../config/config');
const { renderDataset } = require('../../utils/upload-image/responsive');

class SpaceService extends BaseService {
  async getSpace(id) {
    const spaceModel = new SpaceModel();

    const space = await spaceModel.getSpace(id);

    if (isNil(space)) throw new GeneralError(getDataErrorMap['spaceNotFound']);

    this.logger.debug('got a space', { space });

    return space;
  }
  async getPhotosBySpace(id, sort, order) {
    // check space exist
    const spaceModel = new SpaceModel();
    const space = await spaceModel.getSpace(id);
    if (isNil(space)) throw new GeneralError(getPhotoErrorMap['spaceNotFound']);

    // get photos by space which has review
    const photoModel = new PhotoModel();
    const photosWithReviewCount = await photoModel.getPhotosReviewCountBySpace(
      id
    );

    // get photos by space
    const photos = await photoModel.getPhotosBySpace(id, order);

    // combine above two data
    let photosData = await Promise.all(
      photos.map(async (photo) => {
        const dataset = renderDataset(sizeMap.seatPhoto)({
          path: photo.path,
          bucketName: bucketMap.photos,
          assetDomain,
        });

        const data = {
          ...photo,
          dataset,
        };

        const result = R.omit(['path'], data);

        let mappingResult = false;
        for (let i = 0; i < photosWithReviewCount.length; i++) {
          if (photosWithReviewCount[i].photoId === photo.id) {
            photo = {
              ...result,
              usefulCount: photosWithReviewCount[i].usefulCount,
              uselessCount: photosWithReviewCount[i].uselessCount,
              netUsefulCount: photosWithReviewCount[i].netUsefulCount,
            };
            mappingResult = true;
          }
        }
        if (!mappingResult) {
          photo = {
            ...result,
            usefulCount: 0,
            uselessCount: 0,
            netUsefulCount: 0,
          };
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
  async getOtherPhotosBySpace(spaceId, photoId) {
    // check space exist
    const spaceModel = new SpaceModel();
    const space = await spaceModel.getSpace(spaceId);
    if (isNil(space)) throw new GeneralError(getPhotoErrorMap['spaceNotFound']);

    // get photos by space which has review
    const photoModel = new PhotoModel();
    const photosWithReviewCount = await photoModel.getPhotosReviewCountBySpace(
      spaceId
    );

    // get photos by space
    const photos = await photoModel.getOtherPhotosBySpace(spaceId, photoId);

    // combine above two data
    let photosData = await Promise.all(
      photos.map(async (photo) => {
        const dataset = renderDataset(sizeMap.seatPhoto)({
          path: photo.path,
          bucketName: bucketMap.photos,
          assetDomain,
        });

        const data = {
          ...photo,
          dataset,
        };

        const result = R.omit(['path'], data);

        let mappingResult = false;
        for (let i = 0; i < photosWithReviewCount.length; i++) {
          if (photosWithReviewCount[i].photoId === photo.id) {
            photo = {
              ...result,
              usefulCount: photosWithReviewCount[i].usefulCount,
              uselessCount: photosWithReviewCount[i].uselessCount,
              netUsefulCount: photosWithReviewCount[i].netUsefulCount,
            };
            mappingResult = true;
          }
        }
        if (!mappingResult) {
          photo = {
            ...result,
            usefulCount: 0,
            uselessCount: 0,
            netUsefulCount: 0,
          };
        }
        return photo;
      })
    );

    return photosData;
  }
}

module.exports = SpaceService;
