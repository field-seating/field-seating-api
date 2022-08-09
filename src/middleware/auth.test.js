const { uploadAuthenticate } = require('./auth');

describe('uploadAuthenticate', () => {
  it('should return req with no user', async () => {
    const req = {
      headers: {},
    };
    const res = {};
    const next = jest.fn();

    uploadAuthenticate(req, res, next);

    expect(req).not.toHaveProperty('user');
    expect(next).toBeCalledTimes(1);
  });
});
