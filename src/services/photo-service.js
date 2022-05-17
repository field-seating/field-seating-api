const BaseService = require('./base');
const PhotoModel = require('../models/photo');
const PrivateError = require('../errors/error/private-error');
const postPhotoErrorMap = require('../errors/post-photo-error');

class PhotoService extends BaseService {
  async postPhotos(filename, userId, spaceId, dateTime) {
    spaceId = parseInt(spaceId);
    const photoModel = new PhotoModel();
    // creat record and photo
    try {
      const data = await photoModel.createPhoto(
        filename,
        userId,
        spaceId,
        dateTime
      );
      return data;
    } catch (err) {
      if (err.code === 'P2002' && err.meta.target === 'Users_name_key') {
        throw new PrivateError(postPhotoErrorMap['duplicatePath']);
      }
      throw err;
    }
  }
}

module.exports = PhotoService;
