const R = require('ramda');
const { isEmpty } = require('ramda');
const BaseService = require('./base');
const PhotoModel = require('../models/photo');
const SpaceModel = require('../models/space');
const ReviewModel = require('../models/review/index');
const PrivateError = require('../errors/error/private-error');
const GeneralError = require('../errors/error/general-error');
const postPhotoErrorMap = require('../errors/post-photo-error');
const getPhotoErrorMap = require('../errors/get-photo-error');
const { uploadS3 } = require('../utils/upload-image/uploadS3');
const { randomHashName } = require('../utils/upload-image/random-hash-name');
const { resizeImages } = require('../utils/upload-image/resize');
const { bucketMap } = require('../constants/upload-constant');
const { assetDomain } = require('../config/config');
const { sizeMap } = require('../constants/resize-constant');
const {
  renderDataset,
  renderResizeInfo,
} = require('../utils/upload-image/responsive');

class PhotoService extends BaseService {
  async postPhotos(spaceId, files, uniqueKey, userId, date) {
    // check space exist
    const spaceModel = new SpaceModel();
    const spaceCheck = await spaceModel.getSpace(parseInt(spaceId));
    if (!spaceCheck) throw new GeneralError(postPhotoErrorMap['wrongSpaceId']);
    try {
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
    } catch (err) {
      if (err.code === 'P2002' && err.meta.target === 'Photos_path_key') {
        throw new PrivateError(postPhotoErrorMap['duplicatePath']);
      }
      throw err;
    }
  }
  async getPhoto(id) {
    const photoModel = new PhotoModel();
    const photo = await photoModel.getPhoto(id);

    if (!photo) throw new GeneralError(getPhotoErrorMap['photoNotFound']);

    this.logger.debug('got a photo', { photo });

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

    const reviewModel = new ReviewModel();
    const reviewCount = await reviewModel.getReviewCountByPhoto(id);
    if (isEmpty(reviewCount)) {
      const photoInfo = {
        ...result,
        usefulCount: 0,
        uselessCount: 0,
        netUsefulCount: 0,
      };
      return photoInfo;
    }
    const photoInfo = {
      ...result,
      usefulCount: reviewCount[0].usefulCount,
      uselessCount: reviewCount[0].uselessCount,
      netUsefulCount: reviewCount[0].netUsefulCount,
    };
    return photoInfo;
  }
  async getPhotos() {
    // get photos
    const photoModel = new PhotoModel();
    const photos = await photoModel.getPhotos();

    if (isEmpty(photos))
      throw new GeneralError(getPhotoErrorMap['photosNotFound']);

    this.logger.debug('got photos', { photos });

    // get photos which has review
    const photosWithReviewCount = await photoModel.getPhotosReviewCount();

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

module.exports = PhotoService;
