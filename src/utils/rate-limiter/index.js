const { compose, multiply, divide, __, toString, isNil } = require('ramda');
const { getClient, prependPrefix } = require('../../config/redis');

const generateIndex = (key) => {
  const localKey = `rate_limiter:${key}`;
  return prependPrefix(localKey);
};

const timestampToIndex = compose(generateIndex, toString);

const getCurrentWindowTimestamp = (windowSize) => (currentTimestamp) =>
  Math.ceil(currentTimestamp / windowSize) * windowSize;

const getLastWindowTimestamp = (windowSize) => (currentTimestamp) =>
  Math.floor(currentTimestamp / windowSize) * windowSize;

const recordWindowsCount = (client) => async (currentIndex, lastIndex) => {
  const result = await client.multi().get(lastIndex).incr(currentIndex).exec();
  return result.map((str) => Number(str));
};

// need redis connection
const decrWindowCount = (client) => async (windowIndex) => {
  const result = await client.decr(windowIndex);
  return result;
};

const getWeight = (windowSize) => (currentTimestamp) => {
  const lastWindowTimestamp =
    getLastWindowTimestamp(windowSize)(currentTimestamp);

  return (currentTimestamp - lastWindowTimestamp) / windowSize;
};

const toTimestamp = compose(Math.floor, divide(__, 1000), (dateTime) =>
  dateTime.getTime()
);

const isPositveInteger = (num) => Number.isInteger(num) && num > 0;

const rateLimiterHelper =
  ({ windowSize, limit }) =>
  (func, { current, key }) =>
  async (...args) => {
    if (!isPositveInteger(windowSize)) {
      throw new Error('windowSize should be a positive integer');
    }

    if (!isPositveInteger(limit)) {
      throw new Error('limit should be a positive integer');
    }

    if (isNil(key)) {
      throw new Error('key is required');
    }

    const currentTimestamp = toTimestamp(current);

    const getLastWindowIndex = compose(
      timestampToIndex,
      getLastWindowTimestamp(windowSize)
    );

    const getCurrentWindowIndex = compose(
      timestampToIndex,
      getCurrentWindowTimestamp(windowSize)
    );

    const lastIndex = getLastWindowIndex(currentTimestamp);
    const currentIndex = getCurrentWindowIndex(currentTimestamp);

    const client = await getClient();

    const [lastCount, currentCount] = await recordWindowsCount(client)(
      lastIndex,
      currentIndex
    );

    const weighted = multiply(getWeight(windowSize)(currentTimestamp));
    const exceed = currentCount + weighted(lastCount) > limit;

    if (exceed) {
      throw new Error('exceed rate limit');
    }

    try {
      return await func(...args);
    } catch (err) {
      decrWindowCount(client)(currentIndex);
      throw err;
    }
  };

module.exports = rateLimiterHelper;
