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
  getFieldOrientations: async (req, res, next) => {
    try {
      const fieldId = req.params.id;
      const fieldService = new FieldService({ logger: req.logger });
      const orientationList = await fieldService.getOrientationsByField(
        fieldId
      );
      res.status(200).json(resSuccess(orientationList));
    } catch (err) {
      next(err);
    }
  },
  getFieldLevels: async (req, res, next) => {
    try {
      const fieldId = req.params.id;
      const fieldService = new FieldService({ logger: req.logger });
      const levelList = await fieldService.getLevelsByField(fieldId);
      res.status(200).json(resSuccess(levelList));
    } catch (err) {
      next(err);
    }
  },
  getFieldZones: async (req, res, next) => {
    try {
      const fieldId = req.params.id;
      const orientationId = req.query.orientation;
      const levelId = req.query.level;
      const fieldService = new FieldService({ logger: req.logger });
      const zoneList = await fieldService.getZonesByField(
        fieldId,
        orientationId,
        levelId
      );
      res.status(200).json(resSuccess(zoneList));
    } catch (err) {
      next(err);
    }
  },
  getField: async (req, res, next) => {
    try {
      const id = req.params.id;
      const fieldService = new FieldService({ logger: req.logger });
      const field = await fieldService.getField(id);
      res.status(200).json(resSuccess(field));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = fieldController;
