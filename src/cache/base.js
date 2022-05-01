const { isNil } = require('ramda');

const { getClient, prependPrefix } = require('../config/redis');

class CacheBase {
  expiredTime;
  logger;

  constructor({ logger } = { logger: console }) {
    this.logger = logger;
    this.expiredTime = this.getExpiredTime();
  }

  async get(...args) {
    const client = await getClient();

    const key = this.getHashKey();
    const field = this.getFieldName(...args);

    let cachedData = await client.hGet(key, field);

    if (isNil(cachedData)) {
      cachedData = await this.#store(...args);
    }

    const result = JSON.parse(cachedData);

    return result;
  }

  async purgeAll() {
    const client = await getClient();
    const key = this.getHashKey();

    await client.del(key);
  }

  async #store(...args) {
    const source = await this.fetch(...args);
    const value = JSON.stringify(source);

    const client = await getClient();

    const key = this.getHashKey();
    const field = this.getFieldName(...args);

    await client.hSet(key, field, value);
    await client.expire(key, this.expiredTime);

    return value;
  }

  async fetch() {
    throw new Error('unimplemented');
  }

  getFieldName(...args) {
    if (args.length === 0) {
      return 'global';
    }
    return args.join(':');
  }

  getHashKey() {
    return prependPrefix(`${this.getKeyName()}:${this.getVersion()}`);
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
