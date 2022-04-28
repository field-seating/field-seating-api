const rateLimiterHelper = require('./');
const { getClient } = require('../../config/redis');

afterEach(async () => {
  const client = await getClient();
  await client.sendCommand(['FLUSHALL']);
});

afterAll(async () => {
  const client = await getClient();
  await client.disconnect();
});

describe('rateLimiterHelper', () => {
  it('dummy', async () => {
    const func = async () => {
      return 1;
    };

    const withRateLimiter = rateLimiterHelper({
      windowSize: 60,
      limit: 2,
    });

    const withRateLimiterFunc = withRateLimiter(func, {
      current: new Date(),
      key: '1',
    });

    await withRateLimiterFunc();

    expect(1).toBe(2);
  });
});
