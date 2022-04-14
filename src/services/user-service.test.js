const userServices = require('./user-service');
const emailServices = require('./email-service');
const UserModel = require('../models/user');
const signUpErrorMap = require('../errors/sign-up-error');
const verifyErrorMap = require('../errors/verify-error');
const sendEmail = require('../controllers/helpers/send-email');

afterEach(async () => {
  const userModel = new UserModel();
  await userModel._truncate();
});
jest.mock('../controllers/helpers/send-email');
// signUp
describe('user-service.signUp', () => {
  describe('with regular input', () => {
    it('should return desired values without password', async () => {
      const name = 'user1';
      const email = 'example@example.com';
      const password = 'qwerasdf';

      const newUser = await userServices.signUp(name, email, password);
      const expectedResult = {
        name,
        email,
        status: 'notVerify',
      };

      expect(newUser).toMatchObject(expectedResult);
      expect(newUser).not.toHaveProperty('password');
    });
  });

  describe('when create users with duplicate email', () => {
    it('should throw a duplicate error', async () => {
      const email = 'example@example.com';

      await userServices.signUp('user1', email, 'password1');

      try {
        await userServices.signUp('user2', email, 'password2');
      } catch (e) {
        expect(e.code).toBe(signUpErrorMap.duplicateEmail.code);
      }
    });
  });
});

// signIn
describe('user-service.signIn', () => {
  describe('with regular input', () => {
    it('should return desired values without password', async () => {
      const email = 'example@example.com';
      const newUser = await userServices.signUp('user1', email, 'password1');
      const expectedResult = {
        user: newUser,
      };
      const signInUser = await userServices.signIn(newUser.id);
      expect(signInUser).toMatchObject(expectedResult);
      expect(signInUser.user).not.toHaveProperty('password');
      expect(signInUser).toHaveProperty('token');
    });
  });
});

// verifyUser
describe('user-service.verifyUser', () => {
  describe('with regular input', () => {
    it('should return user with status: verified', async () => {
      const email = 'example@example.com';
      const newUser = await userServices.signUp('user1', email, 'password1');
      sendEmail.mockImplementation(() => {
        return {
          sendEmail: {
            name: 'user1',
            email: 'example@example.com',
            url: 'http://test/token',
            sibMessage: ['<202204131533.30577521883.1@smtp-relay.mailin.fr>'],
          },
        };
      });
      const sendVerifyEmail = await emailServices.sendVerifyEmail(newUser);
      const verifyUser = await userServices.verifyUser(sendVerifyEmail.token);
      const expectedResult = {
        status: 'verified',
      };
      expect(verifyUser).toMatchObject(expectedResult);
    });
  });
  describe('with wrong token', () => {
    it('should return error: invalidToken', async () => {
      const email = 'example@example.com';
      const newUser = await userServices.signUp('user1', email, 'password1');
      sendEmail.mockImplementation(() => {
        return {
          sendEmail: {
            name: 'user1',
            email: 'example@example.com',
            url: 'http://test/token',
            sibMessage: ['<202204131533.30577521883.1@smtp-relay.mailin.fr>'],
          },
        };
      });
      const sendVerifyEmail = await emailServices.sendVerifyEmail(newUser);
      const wrongToken = {
        ...sendVerifyEmail,
        token: 'xxx',
      };
      try {
        await userServices.verifyUser(wrongToken.token);
      } catch (e) {
        expect(e.code).toBe(verifyErrorMap.invalidToken.code);
      }
    });
  });
});
