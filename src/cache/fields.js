const CacheBase = require('./base');
const FieldService = require('../services/field-service');

class FieldsCache extends CacheBase {
  async fetch() {
    const fieldService = new FieldService({ logger: this.logger });
    return await fieldService.getFields();
  }

  getKeyName() {
    return 'fields';
  }

  getVersion() {
    return 1;
  }

  getExpiredTime() {
    return 60 * 60 * 24 * 30;
  }
}

module.exports = FieldsCache;
