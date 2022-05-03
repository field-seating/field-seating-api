const { randomString } = require('./random');

describe('randomString', () => {
  it('should match the length', async () => {
    const str = await randomString(4);
    expect(str).toHaveLength(4);
  });
});
