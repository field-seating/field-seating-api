const { getClient } = require('./redis');

describe('incr', () => {
  it('should increase', async () => {
    const client = await getClient();
    const key = 'key';
    let tmpCount = await client.incr(key, 3600);

    const ttl = await client.sendCommand(['ttl', key]);

    expect(ttl).not.toBeLessThan(0);
    expect(tmpCount).toBe(1);

    tmpCount = await client.incr(key, 3600);

    expect(tmpCount).toBe(2);

    const countFromGet = await client.get(key);

    expect(countFromGet).toBe('2');
  });
});

describe('decr', () => {
  it('should decrease', async () => {
    const client = await getClient();
    const key = 'key';
    let tmpCount = await client.decr(key, 3600);

    const ttl = await client.sendCommand(['ttl', key]);

    expect(ttl).not.toBeLessThan(0);
    expect(tmpCount).toBe(-1);

    tmpCount = await client.decr(key, 3600);

    expect(tmpCount).toBe(-2);

    const countFromGet = await client.get(key);

    expect(countFromGet).toBe('-2');
  });
});
