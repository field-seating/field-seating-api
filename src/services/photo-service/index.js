const R = require('ramda');
const { isNil, isEmpty } = require('ramda');
const BaseService = require('../base');
const PhotoModel = require('../../models/photo');
const SpaceModel = require('../../models/space');
const PrivateError = require('../../errors/error/private-error');
const GeneralError = require('../../errors/error/general-error');
const postPhotoErrorMap = require('../../errors/post-photo-error');
const { uploadS3 } = require('../../utils/upload-image/uploadS3');
const { randomHashName } = require('../../utils/upload-image/random-hash-name');
const { resizeImages } = require('../../utils/upload-image/resize');
const { bucketMap } = require('../../constants/upload-constant');
const { assetDomain } = require('../../config/config');
const { sizeMap } = require('../../constants/resize-constant');
const {
  renderDataset,
  renderResizeInfo,
} = require('../../utils/upload-image/responsive');
const renderPhotoResponse = require('../helpers/render-photo-response-helper');
const rateLimiterHelper = require('../../utils/rate-limiter');
const { postPhotoRateLimit } = require('../../config/config');
const rateLimiterErrorMap = require('../../errors/rate-limiter-error');
const resPagination = require('../helpers/response');

class PhotoService extends BaseService {
  async postPhotos(spaceId, files, uniqueKey, date, userId = null) {
    // check space exist
    const spaceModel = new SpaceModel();
    const spaceCheck = await spaceModel.getSpace(parseInt(spaceId));
    if (!spaceCheck) throw new GeneralError(postPhotoErrorMap['wrongSpaceId']);

    // upload function
    async function upload() {
      const uploadInfo = await Promise.all(
        files.map(async (file) => {
          // random filename
          const newFilename = await randomHashName(uniqueKey, 4);
          file.newFilename = newFilename;

          const resizeInfoList = renderResizeInfo(sizeMap.seatPhoto)({
            filename: file.newFilename,
          });

          // resize to large and thumbnail
          const resizeFiles = await resizeImages(file, resizeInfoList);

          // upload to s3
          const bucket = bucketMap.photos;
          resizeFiles.forEach(async (resizeFile) => {
            await uploadS3(resizeFile, bucket);
          });

          // create photo
          const dateTime = new Date(date);
          const path = file.newFilename;
          const photoModel = new PhotoModel();

          const photo = await photoModel.createPhoto(
            path,
            userId,
            parseInt(spaceId),
            dateTime
          );

          const dataset = renderDataset(sizeMap.seatPhoto)({
            path,
            bucketName: bucketMap.photos,
            assetDomain,
          });

          const data = {
            ...photo,
            dataset,
          };

          const result = R.omit(['path'], data);

          return result;
        })
      );
      return uploadInfo;
    }

    // rate limiter helper (for auth user)
    const withRateLimit = rateLimiterHelper({
      windowSize: postPhotoRateLimit.windowSize,
      limit: postPhotoRateLimit.limit,
      key: `postPhotosService:${userId}`,
    });

    try {
      //upload with rate limit or not(noAuth)
      const info = userId ? await withRateLimit(upload)() : await upload();
      this.logger.info('post photo', { info });
      return info;
    } catch (err) {
      if (err.code === 'P2002' && err.meta.target === 'Photos_path_key') {
        throw new PrivateError(postPhotoErrorMap['duplicatePath']);
      }
      if (err.code === rateLimiterErrorMap.exceedLimit.code) {
        throw new GeneralError(postPhotoErrorMap.exceedLimitError);
      }
      throw err;
    }
  }
  async getPhotos(startPhotoId, paginationOption) {
    let photos = null;
    // get photos
    const photoModel = new PhotoModel();

    // if no startPhotoId query
    if (isNil(startPhotoId)) {
      photos = await photoModel.getPhotos(paginationOption);
    } else {
      // has startPhoto query
      //get start photo
      const startPhoto = await photoModel.getPhoto(startPhotoId);

      if (isEmpty(startPhoto))
        return {
          photos: [],
          pagination: resPagination(),
        };

      //get other photos
      const otherPhotos = await photoModel.getOtherPhotosBySpace(
        startPhoto[0].spaceId,
        startPhoto[0].id,
        paginationOption
      );

      // combine photos
      const exceedMount =
        otherPhotos.data.length - paginationOption.limit < 0
          ? otherPhotos.data.length
          : -(otherPhotos.data.length - paginationOption.limit + 1);

      const limitData = otherPhotos.data.slice(0, exceedMount);

      const combineData = [startPhoto[0]].concat(limitData);
      photos = {
        data: combineData,
        cursorId: null,
      };
    }

    // if no photos data
    if (isEmpty(photos.data))
      return {
        photos: [],
        pagination: resPagination(),
      };

    // get photos which has review
    const photosIds = photos.data.map((photo) => {
      return `${photo.id}`;
    });
    const photosWithReviewCount = await photoModel.getPhotosReviewCount(
      photosIds
    );

    // build reviewCount map
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
      pagination: resPagination(photos.cursorId),
    };
    return result;
  }
}

module.exports = PhotoService;
