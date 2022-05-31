const BaseService = require('./base');
const FieldModel = require('../models/field');
const OrientationModel = require('../models/orientation');

class FieldService extends BaseService {
  async getFields() {
    const fieldModel = new FieldModel();
    const fieldList = await fieldModel.getFields();
    this.logger.debug('got a fieldList', { fieldList });
    return fieldList;
  }
  async getFieldsOrientations(fieldId) {
    const orientationModel = new OrientationModel();
    const orientationList = await orientationModel.getOrientationsByField(
      fieldId
    );
    this.logger.debug('got a orientationList', { orientationList });
    return orientationList;
  }
}

module.exports = FieldService;
