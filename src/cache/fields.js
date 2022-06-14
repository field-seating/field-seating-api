const CacheBase = require('./base');
const FieldService = require('../services/field-service');
const { expiredTime, version, keyMap } = require('./constants');

class FieldsCache extends CacheBase {
  async fetch() {
    const fieldService = new FieldService({ logger: this.logger });
    return await fieldService.getFields();
  }

  getKeyName() {
    return keyMap.fields;
  }

  getVersion() {
    return version;
  }

  getExpiredTime() {
    return expiredTime;
  }
}

module.exports = FieldsCache;
