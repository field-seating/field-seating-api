const CacheBase = require('./base');
const ZoneService = require('../services/zone-service');
const { expiredTime, version, keyMap } = require('./constants');

class zonesCache extends CacheBase {
  async fetch(zoneId, spaceType) {
    const zoneService = new ZoneService();
    return await zoneService.getSpacesByZone(zoneId, spaceType);
  }

  getKeyName() {
    return keyMap.spaces;
  }

  getVersion() {
    return version;
  }

  getExpiredTime() {
    return expiredTime;
  }
}

module.exports = zonesCache;
