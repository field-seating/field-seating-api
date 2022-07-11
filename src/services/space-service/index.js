const { isNil, isEmpty } = require('ramda');
const R = require('ramda');
const BaseService = require('../base');
const SpaceModel = require('../../models/space');
const PhotoModel = require('../../models/photo');
const { sortMap } = require('./constant');
const { countMap } = require('../review-service/constant');
const { uselessLimit } = require('../../config/config');
const {
  renderPhotoResponse,
} = require('../helpers/render-photo-response-helper');
const { sortHelper } = require('../helpers/sort-helper');
const { sizeMap } = require('../../constants/resize-constant');
const { bucketMap } = require('../../constants/upload-constant');

class SpaceService extends BaseService {
  async getSpace(id) {
    const spaceModel = new SpaceModel();

    const space = await spaceModel.getSpace(id);

    if (isNil(space)) return null;

    this.logger.debug('got a space', { space });

    return space;
  }
  async getPhotosBySpace(id, paginationOption) {
    const photoModel = new PhotoModel();

    // **if sort by date, we limit in SQL
    if (paginationOption.sort === sortMap.date) {
      const photos = await photoModel.getPhotosBySpace(id, paginationOption);

      // if no photos data
      if (isEmpty(photos.data))
        return {
          photos: [],
          pagination: {
            cursorId: null,
          },
        };

      // get photos which has review
      const photosIds = photos.data.map((photo) => {
        return `${photo.id}`;
      });
      const photosWithReviewCount = await photoModel.getPhotosReviewCount(
        photosIds
      );

      // build reviewCount Map
      const photosWithReviewCountMap = R.indexBy(
        R.prop('photoId'),
        photosWithReviewCount
      );

      // render photos response
      const photosData = renderPhotoResponse(
        photos.data,
        photosWithReviewCountMap,
        sizeMap.seatPhoto,
        bucketMap.photos
      );

      const result = {
        photos: photosData,
        pagination: {
          cursorId: photos.cursorId,
        },
      };
      return result;
    }

    // **if sort by useful, we get all data and sort here
    // get photos by space with no limit and cursor
    const photos = await photoModel.getPhotosBySpace(
      id,
      paginationOption.order
    );

    // get photos by space which has review
    const photosWithReviewCount = await photoModel.getPhotosReviewCountBySpace(
      id
    );

    // build reviewCount map
    const photosWithReviewCountMap = R.indexBy(
      R.prop('photoId'),
      photosWithReviewCount
    );

    // render photos response
    let photosData = renderPhotoResponse(
      photos.data,
      photosWithReviewCountMap,
      sizeMap.seatPhoto,
      bucketMap.photos
    );

    // delete useless data
    photosData = photosData.filter(
      (photo) => photo.netUsefulCount >= uselessLimit.limit
    );

    // sort and order condition
    photosData = sortHelper(photosData, paginationOption.order, countMap.net);

    // limit
    // select data
    photosData = photosData.slice(0, paginationOption.limit);

    const result = {
      photos: photosData,
      pagination: {
        cursorId: null,
      },
    };
    return result;
  }
}

module.exports = SpaceService;
