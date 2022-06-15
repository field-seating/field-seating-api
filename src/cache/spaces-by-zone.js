const CacheBase = require('./base');
const ZoneService = require('../services/zone-service');

class SpacesByZoneCache extends CacheBase {
  async fetch(zoneId, spaceType) {
    const zoneService = new ZoneService({ logger: this.logger });
    return await zoneService.getSpacesByZone(zoneId, spaceType);
  }

  getKeyName() {
    return 'spacesByZone';
  }

  getVersion() {
    return 1;
  }

  getExpiredTime() {
    return 60 * 60 * 24 * 30;
  }
}

module.exports = SpacesByZoneCache;
