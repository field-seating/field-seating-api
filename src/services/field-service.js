const BaseService = require('./base');
const FieldModel = require('../models/field');

class FieldService extends BaseService {
  async getFields() {
    const fieldModel = new FieldModel();
    const fieldList = await fieldModel.getFields();
    this.logger.debug('got a fieldList', { fieldList });
    return fieldList;
  }
}

module.exports = FieldService;
