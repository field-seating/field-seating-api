const { isNil } = require('ramda');

const { getClient, prependPrefix } = require('../config/redis');

// read through
class CacheBase {
  expiredTime;

  constructor() {
    this.expiredTime = this.getExpiredTime();
  }

  async get(...args) {
    const client = await getClient();

    const key = this.getGlobalKey(...args);
    let cachedData = await client.get(key);

    if (isNil(cachedData)) {
      cachedData = await this.#store(...args);
    }

    const result = JSON.parse(cachedData);

    return result;
  }

  async purge(...args) {
    const client = await getClient();
    await client.del(this.getGlobalKey(...args));
  }

  async reload(...args) {
    await this.store(...args);
  }

  async #store(...args) {
    const source = await this.fetch(...args);
    const value = JSON.stringify(source);

    const client = await getClient();

    await client.set(this.getGlobalKey(...args), value, {
      EX: this.expiredTime,
      NX: false,
    });

    return value;
  }

  async fetch() {
    throw new Error('unimplemented');
  }

  getGlobalKey(...args) {
    if (args.length === 0) {
      return prependPrefix(`${this.getKeyName()}:v${this.getVersion()}`);
    }
    return prependPrefix(
      `${this.getKeyName()}:${args.join(':')}:v${this.getVersion()}`
    );
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
