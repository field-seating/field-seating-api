const CacheBase = require('./base');
const FieldService = require('../services/field-service');
const { expiredTime, version, keyMap } = require('./constants');

class zonesCache extends CacheBase {
  async fetch(fieldId, orientationId, levelId) {
    const fieldService = new FieldService({ logger: this.logger });
    return await fieldService.getZonesByField(fieldId, orientationId, levelId);
  }

  getKeyName() {
    return keyMap.zones;
  }

  getVersion() {
    return version;
  }

  getExpiredTime() {
    return expiredTime;
  }
}

module.exports = zonesCache;
