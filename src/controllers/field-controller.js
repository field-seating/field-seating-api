const resSuccess = require('./helpers/response');
const FieldsCache = require('../cache/fields');
const LevelsByFieldCache = require('../cache/levels-by-field');
const OrientationsByFieldCache = require('../cache/orientations-by-field');
const ZonesByFieldCache = require('../cache/zones-by-field');

const fieldController = {
  getFields: async (req, res, next) => {
    try {
      const fieldsCache = new FieldsCache({ logger: req.logger });
      const fieldList = await fieldsCache.get();
      res.status(200).json(resSuccess(fieldList));
    } catch (err) {
      next(err);
    }
  },
  getFieldOrientations: async (req, res, next) => {
    try {
      const fieldId = req.params.id;
      const orientationsByFieldCache = new OrientationsByFieldCache({
        logger: req.logger,
      });
      const orientationList = await orientationsByFieldCache.get(fieldId);
      res.status(200).json(resSuccess(orientationList));
    } catch (err) {
      next(err);
    }
  },
  getFieldLevels: async (req, res, next) => {
    try {
      const fieldId = req.params.id;
      const levelsByFieldCache = new LevelsByFieldCache({ logger: req.logger });
      const levelList = await levelsByFieldCache.get(fieldId);
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
      const zonesByFieldCache = new ZonesByFieldCache({ logger: req.logger });
      const zoneList = await zonesByFieldCache.get(
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
