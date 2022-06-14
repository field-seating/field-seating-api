const CacheBase = require('./base');
const FieldService = require('../services/field-service');
const { expiredTime, version, keyMap } = require('./constants');

class levelsCache extends CacheBase {
  async fetch(fieldId) {
    const fieldService = new FieldService();
    return await fieldService.getLevelsByField(fieldId);
  }

  getKeyName() {
    return keyMap.levels;
  }

  getVersion() {
    return version;
  }

  getExpiredTime() {
    return expiredTime;
  }
}

module.exports = levelsCache;
