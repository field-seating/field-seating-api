const { isNil } = require('ramda');

const { getEnv } = require('../context');
const { getClient } = require('../config/redis');

const prefix = `fs-${getEnv()}`;

class CacheBase {
  key;
  expiredTime;

  constructor() {
    this.expiredTime = this.getExpiredTime();
    this.key = `${prefix}-${this.getKeyName()}-${this.getVersion()}`;
  }

  async get() {
    const client = await getClient();
    let cachedData = await client.get(this.key);

    if (isNil(cachedData)) {
      cachedData = await this.#store();
    }

    const result = JSON.parse(cachedData);

    return result;
  }

  async purge() {
    const client = await getClient();
    await client.del(this.key);
  }

  async reload() {
    this.store();
  }

  async #store() {
    const source = await this.fetch();
    const value = JSON.stringify(source);

    const client = await getClient();

    await client.set(this.key, value, {
      EX: this.expiredTime,
      NX: false,
    });

    return value;
  }

  async fetch() {
    throw new Error('unimplemented');
  }

  getKeyName() {
    throw new Error('unimplemented');
  }

  getVersion() {
    throw new Error('unimplemented');
  }

  getExpiredTime() {
    // TTL default to one day
    return 60 * 60 * 24;
  }
}

module.exports = CacheBase;