const { isNil } = require('ramda');
const BaseService = require('../base');
const FieldModel = require('../../models/field');
const OrientationModel = require('../../models/orientation');
const LevelModel = require('../../models/level');
const ZoneModel = require('../../models/zone');
const GeneralError = require('../../errors/error/general-error');
const getListErrorMap = require('../../errors/get-list-error');
const getDataErrorMap = require('../../errors/get-data-error');

class FieldService extends BaseService {
  async getFields() {
    const fieldModel = new FieldModel();
    const fieldList = await fieldModel.getFields();

    this.logger.debug('got a fieldList', { fieldList });

    return fieldList;
  }
  async getOrientationsByField(fieldId) {
    const orientationModel = new OrientationModel();
    const orientationList = await orientationModel.getOrientationsByField(
      fieldId
    );

    if (!orientationList[0])
      throw new GeneralError(getListErrorMap['orientationsNotFound']);

    this.logger.debug('got a orientationList', { orientationList });

    return orientationList;
  }
  async getLevelsByField(fieldId) {
    console.log('go');
    const levelModel = new LevelModel();
    const levelList = await levelModel.getLevelsByField(fieldId);

    if (!levelList[0])
      throw new GeneralError(getListErrorMap['levelsNotFound']);

    this.logger.debug('got a levelList', { levelList });

    return levelList;
  }
  async getZonesByField(fieldId, orientationId, levelId) {
    const zoneModel = new ZoneModel();
    const zoneList = await zoneModel.getZonesByField(
      fieldId,
      orientationId,
      levelId
    );

    if (!zoneList[0]) throw new GeneralError(getListErrorMap['zonesNotFound']);

    this.logger.debug('got a zoneList', { zoneList });

    return zoneList;
  }
  async getField(id) {
    const fieldModel = new FieldModel();
    const field = await fieldModel.getField(id);

    if (isNil(field)) throw new GeneralError(getDataErrorMap['fieldNotFound']);

    this.logger.debug('got a field', { field });

    return field;
  }
}

module.exports = FieldService;
