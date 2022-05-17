const R = require('ramda');
const PhotoService = require('../services/photo-service');
const SpaceModel = require('../models/space');
const resSuccess = require('./helpers/response');
const getUser = require('./helpers/get-user');
const { uploadS3 } = require('../utils/upload-image/uploadS3');
const { randomHashName } = require('../utils/upload-image/random-hash-name');
const { resizeImages } = require('../utils/upload-image/resize');
const { bucketMap } = require('../constants/upload-constant');
const { sizeMap, formatMap } = require('../constants/resize-constant');
const { domain } = require('../config/config');
const GeneralError = require('../errors/error/general-error');
const postPhotoErrorMap = require('../errors/post-photo-error');

const photoController = {
  postPhotos: async (req, res, next) => {
    try {
      let uploadInfo = [];
      const { spaceId } = req.body;
      const spaceModel = new SpaceModel();

      // check space exist
      const spaceCheck = await spaceModel.getSpace(parseInt(spaceId));
      if (!spaceCheck)
        throw new GeneralError(postPhotoErrorMap['wrongSpaceId']);

      await Promise.all(
        req.files.map(async (file) => {
          // random filename
          const newFilename = await randomHashName(req.requestId, 4);
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
            await uploadS3(resizeFile, bucket); // file for type, bucket for s3 folder, resizeFile for upload file
          });
          const { spaceId, date } = req.body;
          const dateTime = new Date(date);
          const userId = getUser(req).id;

          // create photo
          const photoService = new PhotoService({ logger: req.logger });
          const path = `/${bucketMap.photos}/${file.newFilename}`;
          const photo = await photoService.postPhotos(
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
      res.status(200).json(resSuccess(uploadInfo));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = photoController;
