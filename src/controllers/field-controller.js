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
  getFieldsOrientations: async (req, res, next) => {
    try {
      const fieldId = req.body.id;
      const fieldService = new FieldService({ logger: req.logger });
      const orientationList = await fieldService.getFieldsOrientationsFields(
        fieldId
      );
      res.status(200).json(resSuccess(orientationList));
    } catch (err) {
      next(err);
    }
  },
  getFieldsLevels: async (req, res, next) => {
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
