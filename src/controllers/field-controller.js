const resSuccess = require('./helpers/response');
const FieldsCache = require('../cache/fields');
const LevelsCache = require('../cache/levels');
const OrientationsCache = require('../cache/orientations');
const ZonesCache = require('../cache/zones');

const fieldController = {
  getFields: async (req, res, next) => {
    try {
      const fieldsCache = new FieldsCache({ logger: console });
      const fieldList = await fieldsCache.get();
      res.status(200).json(resSuccess(fieldList));
    } catch (err) {
      next(err);
    }
  },
  getFieldOrientations: async (req, res, next) => {
    try {
      const fieldId = req.params.id;
      const orientationsCache = new OrientationsCache({ logger: console });
      const orientationList = await orientationsCache.get(fieldId);
      res.status(200).json(resSuccess(orientationList));
    } catch (err) {
      next(err);
    }
  },
  getFieldLevels: async (req, res, next) => {
    try {
      const fieldId = req.params.id;
      const levelsCache = new LevelsCache({ logger: console });
      const levelList = await levelsCache.get(fieldId);
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
      const zonesCache = new ZonesCache({ logger: console });
      const zoneList = await zonesCache.get(fieldId, orientationId, levelId);
      res.status(200).json(resSuccess(zoneList));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = fieldController;
