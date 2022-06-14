const CacheBase = require('./base');
const FieldService = require('../services/field-service');

class LevelsByFieldCache extends CacheBase {
  async fetch(fieldId) {
    const fieldService = new FieldService({ logger: this.logger });
    return await fieldService.getLevelsByField(fieldId);
  }

  getKeyName() {
    return 'levels';
  }

  getVersion() {
    return 1;
  }

  getExpiredTime() {
    return 60 * 60 * 24 * 30;
  }
}

module.exports = LevelsByFieldCache;
