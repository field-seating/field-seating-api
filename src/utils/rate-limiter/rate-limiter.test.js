const rateLimiterHelper = require('./');
const { getClient } = require('../../config/redis');
const rateLimiterErrorMap = require('../../errors/rate-limiter-error');

describe('rateLimiterHelper', () => {
  it('should generate the proper key', async () => {
    const func = jest.fn(async () => {});

    const triggerTime1 = new Date(2010, 1, 1, 0, 1, 0);

    const withRateLimit = rateLimiterHelper({
      windowSize: 60,
      limit: 2,
      key: 'key',
    });

    const withRateLimitFunc = withRateLimit(func, {
      current: triggerTime1,
    });

    await withRateLimitFunc();

    const client = await getClient();
    const keys = await client.keys('*:key:*');

    expect(keys).toHaveLength(1);
  });

  it('should get error when exceeding the limit', async () => {
    const func = jest.fn(async () => {});

    const triggerTime1 = new Date(2010, 1, 1, 0, 1, 0);

    const withRateLimit = rateLimiterHelper({
      windowSize: 60,
      limit: 2,
      key: '1',
    });

    const withRateLimitFunc = withRateLimit(func, {
      current: triggerTime1,
    });

    await withRateLimitFunc();
    await withRateLimitFunc();

    try {
      await withRateLimitFunc();
    } catch (err) {
      expect(err.code).toBe(rateLimiterErrorMap.exceedLimit.code);
    }
  });

  it('should decrease the count when the operation exceeds', async () => {
    const func = jest.fn(async () => {});

    const triggerTime1 = new Date(2010, 1, 1, 0, 1, 0);

    const withRateLimit = rateLimiterHelper({
      windowSize: 60,
      limit: 1,
      key: '1',
    });

    const withRateLimitFunc = withRateLimit(func, {
      current: triggerTime1,
    });

    await withRateLimitFunc();

    try {
      await withRateLimitFunc();
    } catch (err) {
      expect(err.code).toBe(rateLimiterErrorMap.exceedLimit.code);
    }

    const client = await getClient();
    const [key] = await client.keys('*');
    const value = await client.get(key);

    expect(Number(value)).toBe(1);
  });

  it('should pass when execute cross the window', async () => {
    const func = jest.fn(async () => {});

    const triggerTime1 = new Date(2010, 1, 1, 0, 1, 0);
    const triggerTime2 = new Date(2010, 1, 1, 0, 2, 2);

    const withRateLimit = rateLimiterHelper({
      windowSize: 60,
      limit: 2,
      key: '1',
    });

    let withRateLimitFunc = withRateLimit(func, {
      current: triggerTime1,
    });

    await withRateLimitFunc();
    await withRateLimitFunc();

    try {
      await withRateLimitFunc();
    } catch (err) {
      expect(err.code).toBe(rateLimiterErrorMap.exceedLimit.code);
    }

    withRateLimitFunc = withRateLimit(func, {
      current: triggerTime2,
    });

    await withRateLimitFunc();

    expect(func.mock.calls).toHaveLength(3);
  });

  it('should throw the exact error when function reject', async () => {
    const err = new Error();
    const errorCode = 'errorCode';
    err.code = errorCode;
    const func = jest.fn(() => Promise.reject(err));

    const triggerTime1 = new Date(2010, 1, 1, 0, 1, 0);

    const withRateLimit = rateLimiterHelper({
      windowSize: 60,
      limit: 2,
      key: '1',
    });

    let withRateLimitFunc = withRateLimit(func, {
      current: triggerTime1,
    });

    try {
      await withRateLimitFunc();
    } catch (err) {
      expect(err.code).toBe(errorCode);
    }
  });
});
