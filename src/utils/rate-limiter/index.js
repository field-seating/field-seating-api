const { compose, multiply, divide, __, toString, isNil } = require('ramda');

const { getClient, prependPrefix } = require('../../config/redis');
const rateLimiterErrorMap = require('../../errors/rate-limiter-error');
const PrivateError = require('../../errors/error/private-error');

const recordWindowsCount =
  (client) => async (currentIndex, lastIndex, expiredTime) => {
    const result = await client
      .multi()
      .get(lastIndex)
      .incr(currentIndex, expiredTime)
      .exec();
    return result.map((str) => Number(str));
  };

//const decrWindowCount = (client) => async (windowIndex, expired) => {
//const result = await client.decr(windowIndex, expired);
//return result;
//};

const generateIndex = (key) => {
  const localKey = `rate_limiter:${key}`;
  return prependPrefix(localKey);
};

const timestampToIndex = compose(generateIndex, toString);

const getCurrentWindowTimestamp = (windowSize) => (currentTimestamp) =>
  Math.ceil(currentTimestamp / windowSize) * windowSize;

const getLastWindowTimestamp = (windowSize) => (currentTimestamp) =>
  Math.floor(currentTimestamp / windowSize) * windowSize;

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
  ({ windowSize, limit, key }) =>
  (func, { current = new Date() } = { current: new Date() }) =>
  async (...args) => {
    if (!isPositveInteger(windowSize)) {
      throw new PrivateError(rateLimiterErrorMap.windowSizeInvalid);
    }

    if (!isPositveInteger(limit)) {
      throw new PrivateError(rateLimiterErrorMap.limitInvalid);
    }

    if (isNil(key)) {
      throw new PrivateError(rateLimiterErrorMap.keyInvalid);
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
      currentIndex,
      2 * windowSize
    );

    const weighted = multiply(getWeight(windowSize)(currentTimestamp));

    const exceed = currentCount + weighted(lastCount) > limit;

    if (exceed) {
      throw new PrivateError(rateLimiterErrorMap.exceedLimit);
    }

    return await func(...args);
  };

module.exports = rateLimiterHelper;
