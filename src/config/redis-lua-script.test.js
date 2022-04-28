const { getClient } = require('./redis');

afterAll(async () => {
  const client = await getClient();
  await client.sendCommand(['FLUSHALL']);
  await client.disconnect();
});

describe('incr', () => {
  it('should increase', async () => {
    const client = await getClient();
    const key = 'key';
    let tmpCount = await client.incr(key);

    expect(tmpCount).toBe(1);

    tmpCount = await client.incr(key);

    expect(tmpCount).toBe(2);

    const countFromGet = await client.get(key);

    expect(countFromGet).toBe('2');
  });
});
