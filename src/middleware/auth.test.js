const { bindUser, authenticatedAdmin } = require('./auth');
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
  describe('with role noAuth', () => {
    it('should return error unauthorized', async () => {
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
          authenticatedAdmin(_req, _res, next);
        });

      await job(req, res);

      expect(req).not.toHaveProperty('user');
      expect(spy).toBeCalledTimes(1);
    });
  });
  describe('with role user', () => {
    it('should return error unauthorized', async () => {
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
          authenticatedAdmin(_req, _res, next);
        });

      await job(req, res);

      expect(req).not.toHaveProperty('user');
      expect(spy).toBeCalledTimes(1);
    });
  });
  describe('with role admin', () => {
    it('should return req user', async () => {
      // create user
      const userModel = new UserModel();
      const data = {
        email: 'testAdmin@example.com',
        name: 'testAdmin',
        password: '12345678',
        token: 'adminTest',
      };
      const newAdmin = await userModel.createAdmin(data);

      const signInAdmin = await userService.signIn(newAdmin.id);

      const req = {
        headers: { authorization: `Bearer ${signInAdmin.token}` },
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
          authenticatedAdmin(_req, _res, next);
        });

      await job(req, res);
      expect(req).toHaveProperty('user');
      expect(req.user.role).toBe('admin');
      expect(spy).toBeCalledTimes(1);
    });
  });
});
