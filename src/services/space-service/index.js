const { isNil, isEmpty } = require('ramda');
const R = require('ramda');
const BaseService = require('../base');
const SpaceModel = require('../../models/space');
const PhotoModel = require('../../models/photo');
const GeneralError = require('../../errors/error/general-error');
const getDataErrorMap = require('../../errors/get-data-error');
const { sortMap, orderMap } = require('./constant');
const { bucketMap } = require('../../constants/upload-constant');
const { sizeMap } = require('../../constants/resize-constant');
const { paginationLimit } = require('../../constants/photo-constant');
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
  async getPhotosBySpace(
    id,
    sort = sortMap.date,
    order = orderMap.desc,
    limit = paginationLimit,
    cursorId
  ) {
    // check space exist
    const spaceModel = new SpaceModel();
    const space = await spaceModel.getSpace(id);
    if (isNil(space)) return [];

    const photoModel = new PhotoModel();

    // if sort by date, we limit in SQL
    if (sort === sortMap.date) {
      const photos = await photoModel.getPhotosBySpace(
        id,
        order,
        limit,
        cursorId
      );

      // if no photos data
      if (isEmpty(photos.data)) return [];

      // get photos which has review
      const photosId = photos.data.map((photo) => {
        return `${photo.id}`;
      });
      const photosWithReviewCount = await photoModel.getPhotosReviewCount(
        photosId
      );

      // combine above two data
      const photosWithReviewCountMap = R.indexBy(
        R.prop('photoId'),
        photosWithReviewCount
      );

      let photosData = photos.data.map((photo) => {
        const id = photo.id.toString();

        // size dataset
        const dataset = renderDataset(sizeMap.seatPhoto)({
          path: photo.path,
          bucketName: bucketMap.photos,
          assetDomain,
        });

        const data = {
          ...photo,
          dataset,
          usefulCount: photosWithReviewCountMap[id]
            ? photosWithReviewCountMap[id].usefulCount
            : 0,
          uselessCount: photosWithReviewCountMap[id]
            ? photosWithReviewCountMap[id].uselessCount
            : 0,
          netUsefulCount: photosWithReviewCountMap[id]
            ? photosWithReviewCountMap[id].netUsefulCount
            : 0,
        };

        const result = R.omit(['path'], data);
        return result;
      });
      return photosData;
    }

    // if sort by useful, we get all data and sort here
    // get photos by space which has review
    const photosWithReviewCount = await photoModel.getPhotosReviewCountBySpace(
      id
    );

    const photosWithReviewCountMap = R.indexBy(
      R.prop('photoId'),
      photosWithReviewCount
    );

    // get photos by space
    const photos = await photoModel.getPhotosBySpace(id, order);

    // combine above two data
    let photosData = photos.data.map((photo) => {
      const id = photo.id.toString();

      // size dataset
      const dataset = renderDataset(sizeMap.seatPhoto)({
        path: photo.path,
        bucketName: bucketMap.photos,
        assetDomain,
      });

      const data = {
        ...photo,
        dataset,
        usefulCount: photosWithReviewCountMap[id]
          ? photosWithReviewCountMap[id].usefulCount
          : 0,
        uselessCount: photosWithReviewCountMap[id]
          ? photosWithReviewCountMap[id].uselessCount
          : 0,
        netUsefulCount: photosWithReviewCountMap[id]
          ? photosWithReviewCountMap[id].netUsefulCount
          : 0,
      };

      const result = R.omit(['path'], data);
      return result;
    });

    // delete useless data
    photosData = photosData.filter(
      (photo) => photo.netUsefulCount >= uselessLimit.limit
    );

    // sort and order condition
    if (sort === sortMap.useful && order === orderMap.desc) {
      photosData = photosData.sort(
        (a, b) => b.netUsefulCount - a.netUsefulCount
      );
    }
    if (sort === sortMap.useful && order === orderMap.asc) {
      photosData = photosData.sort(
        (a, b) => a.netUsefulCount - b.netUsefulCount
      );
    }

    // cursor and limit
    // find index which the cursorId in
    const cursorIndex = R.findIndex(R.propEq('id', cursorId))(photosData);

    // if  cursorId not found
    if (cursorIndex === -1) {
      photosData = photosData.slice(0, limit);
    } else {
      photosData = photosData.slice(cursorIndex, cursorIndex + limit);
    }

    return photosData;
  }
}

module.exports = SpaceService;
