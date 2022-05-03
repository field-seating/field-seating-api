const recordServices = require('../services/record-service');
const resSuccess = require('./helpers/response');
const getUser = require('../controllers/helpers/get-user');

const recordController = {
  postRecord: async (req, res, next) => {
    try {
      const { filename, spaceId, date } = req.body;
      console.log(filename);
      const userId = getUser(req).id;
      const dateTime = new Date(date);
      console.log(userId);
      console.log(spaceId);
      console.log(dateTime);
      const record = await recordServices.postRecord(
        filename,
        userId,
        spaceId,
        dateTime
      );
      res.status(200).json(resSuccess(record));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = recordController;
