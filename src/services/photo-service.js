const R = require('ramda');
const { isNil, isEmpty } = require('ramda');
const BaseService = require('./base');
const PhotoModel = require('../models/photo');
const SpaceModel = require('../models/space');
const PrivateError = require('../errors/error/private-error');
const GeneralError = require('../errors/error/general-error');
const postPhotoErrorMap = require('../errors/post-photo-error');
const { uploadS3 } = require('../utils/upload-image/uploadS3');
const { randomHashName } = require('../utils/upload-image/random-hash-name');
const { resizeImages } = require('../utils/upload-image/resize');
const { bucketMap } = require('../constants/upload-constant');
const { assetDomain } = require('../config/config');
const { sizeMap } = require('../constants/resize-constant');
const { paginationLimit } = require('../constants/photo-constant');
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
  async getPhotos(startPhotoId, limit = paginationLimit, cursorId) {
    let photos = [];
    // get photos
    const photoModel = new PhotoModel();

    // if no startPhoto query
    if (isNil(startPhotoId)) {
      photos = await photoModel.getPhotos(limit, cursorId);
    } else {
      // has startPhoto query
      const photoModel = new PhotoModel();
      //get start photo
      const startPhoto = await photoModel.getPhoto(startPhotoId);

      if (isNil(startPhoto)) return [];

      //get other photos
      const otherPhotos = await photoModel.getOtherPhotosBySpace(
        startPhoto.spaceId,
        startPhoto.id,
        limit,
        cursorId
      );

      photos = otherPhotos;

      // if no cursorId we need startPhoto
      if (!cursorId) {
        let combinedPhotos = otherPhotos;
        combinedPhotos.data.pop();
        combinedPhotos.data.unshift(startPhoto);
        photos = combinedPhotos;
      }
    }

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

    const result = {
      data: photosData,
      pagination: {
        cursorId: photos.cursorId,
      },
    };

    return result;
  }
}

module.exports = PhotoService;
