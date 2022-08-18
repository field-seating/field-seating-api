const { bindUser } = require('./auth');
const UserModel = require('../models/user');
const UserService = require('../services/user-service');

afterEach(async () => {
  const userModel = new UserModel();
  await userModel._truncate();
});

const userService = new UserService({
  logger: console,
});

describe('bindUser', () => {
  describe('with no auth', () => {
    it('should return req with no user', async () => {
      const req = {
        headers: {},
      };
      const res = {};
      const spy = jest.fn();

      const job = (_req, _res) =>
        new Promise((resolve) => {
          const next = () => {
            spy();
            resolve();
          };
          bindUser(_req, _res, next);
        });

      await job(req, res);

      expect(req).not.toHaveProperty('user');
      expect(spy).toBeCalledTimes(1);
    });
  });
  describe('with a user', () => {
    it('should return req user', async () => {
      // create user
      const name = 'testUser';
      const email = 'testuser@example.com';
      const password = '12345678';
      const newUser = await userService.signUp(name, email, password);

      const signInUser = await userService.signIn(newUser.id);

      const req = {
        headers: { authorization: `Bearer ${signInUser.token}` },
        logger: { child: () => {} },
      };
      const res = {};
      const spy = jest.fn();

      const job = (_req, _res) =>
        new Promise((resolve) => {
          const next = () => {
            spy();
            resolve();
          };
          bindUser(_req, _res, next);
        });

      await job(req, res);

      expect(req).toHaveProperty('user');
      expect(spy).toBeCalledTimes(1);
    });
  });
});
describe('authenticatedAdmin', () => {
  describe('with role admin', () => {
    it('should return req with no user', async () => {
      const req = {
        headers: {},
      };
      const res = {};
      const spy = jest.fn();

      const job = (_req, _res) =>
        new Promise((resolve) => {
          const next = () => {
            spy();
            resolve();
          };
          bindUser(_req, _res, next);
        });

      await job(req, res);

      expect(req).not.toHaveProperty('user');
      expect(spy).toBeCalledTimes(1);
    });
  });
  describe('with role user', () => {
    it('should return req user', async () => {
      // create user
      const name = 'testUser';
      const email = 'testuser@example.com';
      const password = '12345678';
      const newUser = await userService.signUp(name, email, password);

      const signInUser = await userService.signIn(newUser.id);

      const req = {
        headers: { authorization: `Bearer ${signInUser.token}` },
        logger: { child: () => {} },
      };
      const res = {};
      const spy = jest.fn();

      const job = (_req, _res) =>
        new Promise((resolve) => {
          const next = () => {
            spy();
            resolve();
          };
          bindUser(_req, _res, next);
        });

      await job(req, res);

      expect(req).toHaveProperty('user');
      expect(spy).toBeCalledTimes(1);
    });
  });
});
