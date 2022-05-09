const BaseService = require('./base');
const PhotoModel = require('../models/photo');

class PhotoService extends BaseService {
  async postPhotos(filename, userId, spaceId, dateTime) {
    spaceId = parseInt(spaceId);
    const photoModel = new PhotoModel();
    // creat record and photo
    const data = await photoModel.createPhoto(
      filename,
      userId,
      spaceId,
      dateTime
    );
    return data;
  }
}

module.exports = PhotoService;
