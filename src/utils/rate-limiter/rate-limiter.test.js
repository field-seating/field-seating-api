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
    const func = jest.fn(async (x) => x);

    const triggerTime1 = new Date(2010, 1, 1, 0, 1, 0);

    const withRateLimiter = rateLimiterHelper({
      windowSize: 60,
      limit: 2,
    });

    const withRateLimiterFunc = withRateLimiter(func, {
      current: triggerTime1,
      key: '1',
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
    const func = jest.fn(async (x) => x);

    const triggerTime1 = new Date(2010, 1, 1, 0, 1, 0);
    const triggerTime2 = new Date(2010, 1, 1, 0, 2, 2);

    const withRateLimiter = rateLimiterHelper({
      windowSize: 60,
      limit: 2,
    });

    let withRateLimiterFunc = withRateLimiter(func, {
      current: triggerTime1,
      key: '1',
    });

    await withRateLimiterFunc();
    await withRateLimiterFunc();

    withRateLimiterFunc = withRateLimiter(func, {
      current: triggerTime1,
      key: '1',
    });

    try {
      await withRateLimiterFunc();
    } catch (err) {
      expect(err.code).toBe(rateLimiterErrorMap.exceedLimit.code);
    }

    withRateLimiterFunc = withRateLimiter(func, {
      current: triggerTime2,
      key: '1',
    });

    await withRateLimiterFunc();

    expect(func.mock.calls).toHaveLength(3);
  });
});
