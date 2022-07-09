const { isNil, isEmpty } = require('ramda');
const R = require('ramda');
const BaseService = require('../base');
const SpaceModel = require('../../models/space');
const PhotoModel = require('../../models/photo');
const { sortMap, orderMap } = require('./constant');
const { uselessLimit } = require('../../config/config');
const { combine } = require('../helpers/combine-helper');
const { sortHelper } = require('../helpers/sort-helper');

class SpaceService extends BaseService {
  async getSpace(id) {
    const spaceModel = new SpaceModel();

    const space = await spaceModel.getSpace(id);

    if (isNil(space)) return null;

    this.logger.debug('got a space', { space });

    return space;
  }
  async getPhotosBySpace(
    id,
    sort = sortMap.date,
    order = orderMap.desc,
    paginationOption
  ) {
    const photoModel = new PhotoModel();

    // **if sort by date, we limit in SQL
    if (sort === sortMap.date) {
      const photos = await photoModel.getPhotosBySpace(
        id,
        order,
        paginationOption
      );

      // if no photos data
      if (isEmpty(photos.data)) return null;

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

      // combine above two data
      const photosData = combine(photos.data, photosWithReviewCountMap);

      const result = {
        data: photosData,
        pagination: {
          cursorId: photos.cursorId,
        },
      };
      return result;
    }

    // **if sort by useful, we get all data and sort here
    // get photos by space with no limit and cursor
    const photos = await photoModel.getPhotosBySpace(id, order);

    // get photos by space which has review
    const photosWithReviewCount = await photoModel.getPhotosReviewCountBySpace(
      id
    );

    // build reviewCount map
    const photosWithReviewCountMap = R.indexBy(
      R.prop('photoId'),
      photosWithReviewCount
    );

    // combine above two data
    let photosData = combine(photos.data, photosWithReviewCountMap);

    // delete useless data
    photosData = photosData.filter(
      (photo) => photo.netUsefulCount >= uselessLimit.limit
    );

    // sort and order condition
    photosData = sortHelper(photosData, order);

    // cursor and limit
    // find index which the cursorId in
    const cursorIndex = R.findIndex(
      R.propEq('id', Number(paginationOption.cursorId))
    )(photosData);

    const nextCursorId = photosData[cursorIndex + paginationOption.limit]
      ? photosData[cursorIndex + paginationOption.limit].id
      : null;

    // select data
    photosData = photosData.slice(
      cursorIndex + 1,
      cursorIndex + paginationOption.limit + 1
    );

    const result = {
      data: photosData,
      pagination: {
        cursorId: nextCursorId,
      },
    };
    return result;
  }
}

module.exports = SpaceService;
