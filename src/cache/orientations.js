const CacheBase = require('./base');
const FieldService = require('../services/field-service');

class OrientationsByFieldCache extends CacheBase {
  async fetch(fieldId) {
    const fieldService = new FieldService({ logger: this.logger });
    return await fieldService.getOrientationsByField(fieldId);
  }

  getKeyName() {
    return 'orientationsByField';
  }

  getVersion() {
    return 1;
  }

  getExpiredTime() {
    return 60 * 60 * 24 * 30;
  }
}

module.exports = OrientationsByFieldCache;
