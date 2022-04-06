const recordServices = require('../services/record-service');
const resSuccess = require('./helpers/response');
// const getUser = require('../controllers/helpers/get-user');

const recordController = {
  postRecord: async (req, res, next) => {
    try {
      const { spaceId, date } = req.body;
      const userId = 3; // 等待auth合併進來用getUser取得
      const dateTime = new Date(date);
      const record = await recordServices.postRecord(userId, spaceId, dateTime);
      res.status(200).json(resSuccess(record));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = recordController;
