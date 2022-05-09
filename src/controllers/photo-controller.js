const PhotoService = require('../services/photo-service');
const SpaceService = require('../services/space-service');
const resSuccess = require('./helpers/response');
const getUser = require('./helpers/get-user');
const { uploadS3 } = require('../utils/upload-image/uploadS3');
const { randomHashName } = require('../utils/upload-image/random-hash-name');
const { resizeImages } = require('../utils/upload-image/resize');
const { bucketMap } = require('../constants/bucket-constant');
const GeneralError = require('../errors/error/general-error');
const postPhotoErrorMap = require('../errors/post-photo-error');

const recordController = {
  postPhotos: async (req, res, next) => {
    try {
      let uploadInfo = [];
      const { spaceId } = req.body;
      const spaceService = new SpaceService({ logger: req.logger });

      // check space exist
      const spaceCheck = await spaceService.getSpace(spaceId);
      if (!spaceCheck)
        throw new GeneralError(postPhotoErrorMap['wrongSpaceId']);

      await Promise.all(
        req.files.map(async (file) => {
          // random filename
          const newFilename = await randomHashName(req.requestId, 4);
          file.newFilename = newFilename;

          // resize to large and thumbnail
          const resizeFiles = await resizeImages(file);

          // upload to s3
          const bucket = bucketMap.photos;
          resizeFiles.map(async (resizeFile) => {
            await uploadS3(file, bucket, resizeFile); // file for type, bucket for s3 folder, resizeFile for upload file
          });
          const { spaceId, date } = req.body;
          const dateTime = new Date(date);
          const userId = getUser(req).id;

          // create photo
          const photoService = new PhotoService({ logger: req.logger });
          const photo = await photoService.postPhotos(
            file.newFilename,
            userId,
            spaceId,
            dateTime
          );
          uploadInfo.push(photo);
        })
      );
      res.status(200).json(resSuccess(uploadInfo));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = recordController;
