const CacheBase = require('./base');
const FieldService = require('../services/field-service');
const { expiredTime, version, keyMap } = require('./constants');

class orientationsCache extends CacheBase {
  async fetch(fieldId) {
    const fieldService = new FieldService({ logger: this.logger });
    return await fieldService.getOrientationsByField(fieldId);
  }

  getKeyName() {
    return keyMap.orientations;
  }

  getVersion() {
    return version;
  }

  getExpiredTime() {
    return expiredTime;
  }
}

module.exports = orientationsCache;
