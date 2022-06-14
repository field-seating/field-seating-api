const CacheBase = require('./base');
const FieldService = require('../services/field-service');

class ZonesByFieldCache extends CacheBase {
  async fetch(fieldId, orientationId, levelId) {
    const fieldService = new FieldService({ logger: this.logger });
    return await fieldService.getZonesByField(fieldId, orientationId, levelId);
  }

  getKeyName() {
    return 'zonesByField';
  }

  getVersion() {
    return 1;
  }

  getExpiredTime() {
    return 60 * 60 * 24 * 30;
  }
}

module.exports = ZonesByFieldCache;
