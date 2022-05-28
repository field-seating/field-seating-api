const FieldService = require('../services/field-service');
const resSuccess = require('./helpers/response');

const fieldController = {
  getFields: async (req, res, next) => {
    try {
      const fieldService = new FieldService({ logger: req.logger });
      const fieldList = await fieldService.getFields();
      res.status(200).json(resSuccess(fieldList));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = fieldController;
