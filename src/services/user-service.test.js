const { addSeconds } = require('date-fns');
const UserModel = require('../models/user');
const signUpErrorMap = require('../errors/sign-up-error');
const verifyErrorMap = require('../errors/verify-error');
const { statusMap } = require('../models/user/constants');
const UserService = require('./user-service');
const userService = new UserService({ req: { requestId: '' } });
const { verificationTokenLife } = require('../constants/token-life-constant');

beforeEach(async () => {
  jest.resetModules();
});
afterEach(async () => {
  const userModel = new UserModel();
  await userModel._truncate();
});

describe('user-service.signUp', () => {
  describe('with regular input', () => {
    it('should return desired values without password', async () => {
      // create user and mock token
      const name = 'user1';
      const email = 'example@example.com';
      const password = 'qwerasdf';
      const newUser = await userService.signUp(name, email, password);
      const expectedResult = {
        name,
        email,
        status: statusMap.unverified,
      };

      expect(newUser).toMatchObject(expectedResult);
      expect(newUser).toHaveProperty('verificationToken');
      expect(newUser).not.toHaveProperty('password');
    });
  });

  describe('when create users with duplicate email', () => {
    it('should throw a duplicate error', async () => {
      const email = 'example@example.com';
      await userService.signUp('user1', email, 'password1');
      try {
        await userService.signUp('user2', email, 'password2');
      } catch (e) {
        expect(e.code).toBe(signUpErrorMap.duplicateEmail.code);
      }
    });
  });
});

describe('user-service.signIn', () => {
  describe('with regular input', () => {
    it('should return desired values without password', async () => {
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      const expectedResult = {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      };
      const signInUser = await userService.signIn(newUser.id);
      expect(signInUser).toMatchObject(expectedResult);
      expect(signInUser.user).not.toHaveProperty('password');
      expect(signInUser).toHaveProperty('token');
    });
  });
});

describe('user-service.verifyEmail', () => {
  describe('with regular input', () => {
    it('should return user with status: verified', async () => {
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      // verifyUser
      const verifyUser = await userService.verifyEmail(
        newUser.verificationToken
      );
      // make sure the user to be verified
      expect(verifyUser).toBe(true);
    });
  });

  describe('with wrong token', () => {
    it('should return error: invalidToken', async () => {
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      // create wrong token
      const wrongToken = `${newUser.verificationToken}xx`;

      try {
        await userService.verifyEmail(wrongToken);
      } catch (e) {
        // make sure get the right err code
        expect(e.code).toBe(verifyErrorMap.invalidToken.code);
      }
    });
  });

  describe('with expired token', () => {
    it('should return error: invalidToken', async () => {
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');

      // make a fake day which expired token life
      const mockDate = addSeconds(new Date(), verificationTokenLife);
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
      try {
        const test = await userService.verifyEmail(newUser.verificationToken);
        console.log(test);
      } catch (e) {
        console.log(e);
        // make sure get the right err code
        expect(e.code).toBe(verifyErrorMap.invalidToken.code);
      }
      // clean
      jest.useRealTimers();
    });
  });
});

describe('user-service.gerUserInfo', () => {
  describe('with correct user and no password in return', () => {
    it('should return desired values which same with request user', async () => {
      const data = {
        name: 'user',
        email: 'example@example.com',
        password: 'password1',
      };
      const userModel = new UserModel();
      const newUser = await userModel.createUser(data);
      const userInfo = await userService.getUserInfo(newUser.id);
      const expectedResult = {
        id: newUser.id,
      };
      expect(userInfo).toMatchObject(expectedResult);
      expect(userInfo).not.toHaveProperty('password');
    });
  });
});

describe('user-service.flushToken', () => {
  describe('with regular input', () => {
    it('should return new token', async () => {
      const UserService = require('./user-service');
      const userService = new UserService({ req: { requestId: '' } });
      // create user and mock token
      jest.mock('../services/helpers/token-generator');
      const tokenGenerator = require('../services/helpers/token-generator');
      tokenGenerator.mockImplementation(() => {
        return 'expiredTokenToRefresh';
      });
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      // verifyUser
      tokenGenerator.mockImplementation(() => {
        return 'flushToken';
      });
      const verifyUser = await userService.flushToken(newUser.id);
      // make sure get a new token
      const expectedResult = 'flushToken';
      expect(tokenGenerator).toHaveBeenCalledTimes(2);
      expect(verifyUser).toBe(expectedResult);
    });
  });
});
