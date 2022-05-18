const R = require('ramda');
const BaseService = require('./base');
const PhotoModel = require('../models/photo');
const SpaceModel = require('../models/space');
const PrivateError = require('../errors/error/private-error');
const GeneralError = require('../errors/error/general-error');
const postPhotoErrorMap = require('../errors/post-photo-error');
const { uploadS3 } = require('../utils/upload-image/uploadS3');
const { randomHashName } = require('../utils/upload-image/random-hash-name');
const { resizeImages } = require('../utils/upload-image/resize');
const { sizeMap, formatMap } = require('../constants/resize-constant');
const { bucketMap } = require('../constants/upload-constant');
const { domain } = require('../config/config');

class PhotoService extends BaseService {
  async postPhotos(spaceId, files, requestId, userId, date) {
    console.log(date);
    let uploadInfo = [];
    // check space exist
    const spaceModel = new SpaceModel();
    const spaceCheck = await spaceModel.getSpace(parseInt(spaceId));
    if (!spaceCheck) throw new GeneralError(postPhotoErrorMap['wrongSpaceId']);
    try {
      await Promise.all(
        files.map(async (file) => {
          // random filename
          const newFilename = await randomHashName(requestId, 4);
          file.newFilename = newFilename;

          // resize to large and thumbnail
          const resizeFiles = await resizeImages(
            file,
            sizeMap.seatPhoto,
            formatMap.jpeg
          );

          // upload to s3
          const bucket = bucketMap.photos;
          resizeFiles.map(async (resizeFile) => {
            await uploadS3(resizeFile, bucket);
          });

          const dateTime = new Date(date);
          const path = `/${bucketMap.photos}/${file.newFilename}`;

          spaceId = parseInt(spaceId);
          const photoModel = new PhotoModel();
          //   // creat record and photo

          const photo = await photoModel.createPhoto(
            path,
            userId,
            spaceId,
            dateTime
          );
          const data = {
            ...photo,
            url: `https://${domain}.com${photo.path}`,
          };
          const result = R.omit(['path'], data);
          uploadInfo.push(result);
        })
      );
      return uploadInfo;
    } catch (err) {
      if (err.code === 'P2002' && err.meta.target === 'Photos_path_key') {
        throw new PrivateError(postPhotoErrorMap['duplicatePath']);
      }
      throw new PrivateError(err);
    }
  }
}

module.exports = PhotoService;
