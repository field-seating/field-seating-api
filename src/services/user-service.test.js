const UserService = require('./user-service');
const UserModel = require('../models/user');
const signUpErrorMap = require('../errors/sign-up-error');
const verifyErrorMap = require('../errors/verify-error');
const resendVerifyEmailErrorMap = require('../errors/resend-verify-email-error');
const { statusMap } = require('../models/user/constants');
const { subDays, subMinutes } = require('date-fns');
const tokenGenerator = require('../services/helpers/token-generator');
const {
  verificationTokenLife,
  resendLimitTime,
} = require('../constants/token-life-constant');

afterEach(async () => {
  const userModel = new UserModel();
  await userModel._truncate();
});
jest.mock('../services/helpers/token-generator');

const userService = new UserService({ req: { requestId: '' } });

// signUp
describe('user-service.signUp', () => {
  describe('with regular input', () => {
    it('should return desired values without password', async () => {
      // create user and mock token
      const name = 'user1';
      const email = 'example@example.com';
      const password = 'qwerasdf';
      tokenGenerator.mockImplementation(() => {
        return {
          token: 'xxx',
          date: new Date(),
        };
      });
      const newUser = await userService.signUp(name, email, password);

      const expectedResult = {
        name,
        email,
        status: statusMap.unverified,
      };
      expect(tokenGenerator).toHaveBeenCalled();
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

// signIn;
describe('user-service.signIn', () => {
  describe('with regular input', () => {
    it('should return desired values without password', async () => {
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      delete newUser.verificationToken;
      const expectedResult = {
        user: newUser,
      };
      const signInUser = await userService.signIn(newUser.id);
      expect(signInUser).toMatchObject(expectedResult);
      expect(signInUser.user).not.toHaveProperty('password');
      expect(signInUser).toHaveProperty('token');
    });
  });
});

// verifyEmail
describe('user-service.verifyEmail', () => {
  describe('with regular input', () => {
    it('should return user with status: verified', async () => {
      // create user and mock token
      tokenGenerator.mockImplementation(() => {
        return {
          token: '123',
          date: new Date(),
        };
      });
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');

      // verifyUser
      const verifyUser = await userService.verifyEmail(
        newUser.verificationToken
      );

      // make sure the user to be verified
      const expectedResult = true;
      expect(verifyUser).toBe(expectedResult);
    });
  });

  describe('with wrong token', () => {
    it('should return error: invalidToken', async () => {
      // create wrong token
      const wrongToken = 'wrongToken';

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
      // create user and expired token
      const email = 'example@example.com';
      const expiredTime = subDays(new Date(), verificationTokenLife);
      tokenGenerator.mockImplementation(() => {
        return {
          token: 'expiredToken',
          date: expiredTime,
        };
      });
      const newUser = await userService.signUp('user1', email, 'password1');

      try {
        await userService.verifyEmail(newUser.verificationToken);
      } catch (e) {
        // make sure get the right err code
        expect(e.code).toBe(verifyErrorMap.invalidToken.code);
      }
    });
  });
});

// getUserInfo
describe('user-service.gerUserInfo', () => {
  describe('with correct user and no password in return', () => {
    it('should return desired values which same with request user', async () => {
      const data = {
        name: 'user1',
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

// refreshToken
describe('user-service.refreshToken', () => {
  describe('with regular input', () => {
    it('should return new token', async () => {
      // create user and mock token
      const expiredTime = subDays(new Date(), verificationTokenLife);
      tokenGenerator.mockImplementation(() => {
        return {
          token: 'expiredTokenToRefresh',
          date: expiredTime,
        };
      });
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');

      // verifyUser
      tokenGenerator.mockImplementation(() => {
        return {
          token: 'refreshToken',
          date: new Date(),
        };
      });
      const verifyUser = await userService.refreshToken(newUser.id);

      // make sure get a new token
      const expectedResult = 'refreshToken';
      expect(tokenGenerator).toHaveBeenCalledTimes(2);
      expect(verifyUser).toBe(expectedResult);
    });
  });

  describe('with not arrive resend time', () => {
    it('should return duplicateSend error', async () => {
      // create user and mock token
      const notToResendTime = subMinutes(new Date(), resendLimitTime - 1);
      tokenGenerator.mockImplementation(() => {
        return {
          token: 'notYetToRefreshToken',
          date: notToResendTime,
        };
      });
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');

      // make sure get a duplicateSend error
      try {
        await userService.refreshToken(newUser.id);
      } catch (e) {
        expect(e.code).toBe(resendVerifyEmailErrorMap.duplicateSend.code);
      }
    });
  });
});
