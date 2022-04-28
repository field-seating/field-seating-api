const { getClient } = require('./redis');

afterEach(async () => {
  const client = await getClient();
  await client.sendCommand(['FLUSHALL']);
});

afterAll(async () => {
  const client = await getClient();
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

describe('decr', () => {
  it('should decrease', async () => {
    const client = await getClient();
    const key = 'key';
    let tmpCount = await client.decr(key);

    expect(tmpCount).toBe(-1);

    tmpCount = await client.decr(key);

    expect(tmpCount).toBe(-2);

    const countFromGet = await client.get(key);

    expect(countFromGet).toBe('-2');
  });
});
