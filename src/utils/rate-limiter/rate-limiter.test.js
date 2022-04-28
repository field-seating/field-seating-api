const rateLimiterHelper = require('./');
const { getClient } = require('../../config/redis');
const rateLimiterErrorMap = require('../../errors/rate-limiter-error');

afterEach(async () => {
  const client = await getClient();
  await client.sendCommand(['FLUSHALL']);
});

afterAll(async () => {
  const client = await getClient();
  await client.disconnect();
});

describe('rateLimiterHelper', () => {
  it('should get error when exceeding the limit', async () => {
    const func = jest.fn(async () => {});

    const triggerTime1 = new Date(2010, 1, 1, 0, 1, 0);

    const withRateLimiter = rateLimiterHelper({
      windowSize: 60,
      limit: 2,
      key: '1',
    });

    const withRateLimiterFunc = withRateLimiter(func, {
      current: triggerTime1,
    });

    await withRateLimiterFunc();
    await withRateLimiterFunc();

    try {
      await withRateLimiterFunc();
    } catch (err) {
      expect(err.code).toBe(rateLimiterErrorMap.exceedLimit.code);
    }
  });

  it('should pass when execute cross the window', async () => {
    const func = jest.fn(async () => {});

    const triggerTime1 = new Date(2010, 1, 1, 0, 1, 0);
    const triggerTime2 = new Date(2010, 1, 1, 0, 2, 2);

    const withRateLimiter = rateLimiterHelper({
      windowSize: 60,
      limit: 2,
      key: '1',
    });

    let withRateLimiterFunc = withRateLimiter(func, {
      current: triggerTime1,
    });

    await withRateLimiterFunc();
    await withRateLimiterFunc();

    try {
      await withRateLimiterFunc();
    } catch (err) {
      expect(err.code).toBe(rateLimiterErrorMap.exceedLimit.code);
    }

    withRateLimiterFunc = withRateLimiter(func, {
      current: triggerTime2,
    });

    await withRateLimiterFunc();

    expect(func.mock.calls).toHaveLength(3);
  });

  it('should throw the exact error when function reject', async () => {
    const err = new Error();
    const errorCode = 'errorCode';
    err.code = errorCode;
    const func = jest.fn(() => Promise.reject(err));

    const triggerTime1 = new Date(2010, 1, 1, 0, 1, 0);

    const withRateLimiter = rateLimiterHelper({
      windowSize: 60,
      limit: 2,
      key: '1',
    });

    let withRateLimiterFunc = withRateLimiter(func, {
      current: triggerTime1,
    });

    try {
      await withRateLimiterFunc();
    } catch (err) {
      expect(err.code).toBe(errorCode);
    }
  });
});
