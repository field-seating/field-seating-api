const SpaceModel = require('../models/space');
const RecordModel = require('../models/record');

const recordService = {
  postRecord: async (filename, userId, spaceId, date) => {
    console.log('goservice');
    spaceId = parseInt(spaceId);
    const spaceModel = new SpaceModel();
    const recordModel = new RecordModel();
    // check spaceId exist
    const spaceCheck = await spaceModel.getSpace(spaceId);
    // creat record and photo
    const data = await recordModel.createRecord(
      filename,
      userId,
      spaceCheck.id,
      date
    );
    return data;
  },
};

module.exports = recordService;
