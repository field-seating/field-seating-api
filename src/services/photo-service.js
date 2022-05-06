const SpaceModel = require('../models/space');
const PhotoModel = require('../models/photo');

const photoService = {
  postPhotos: async (filename, userId, spaceId, dateTime) => {
    spaceId = parseInt(spaceId);
    const spaceModel = new SpaceModel();
    const photoModel = new PhotoModel();
    // check spaceId exist
    const spaceCheck = await spaceModel.getSpace(spaceId);
    // creat record and photo
    const data = await photoModel.createPhoto(
      filename,
      userId,
      spaceCheck.id,
      dateTime
    );
    return data;
  },
};

module.exports = photoService;
