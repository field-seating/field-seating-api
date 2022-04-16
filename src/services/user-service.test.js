const EmailService = require('./email-service');
const UserService = require('./user-service');
const UserModel = require('../models/user/index');
const signUpErrorMap = require('../errors/sign-up-error');
const verifyErrorMap = require('../errors/verify-error');
const sendEmail = require('../services/helpers/send-email');
const { statusMap } = require('../models/user/constants');

afterEach(async () => {
  const userModel = new UserModel();
  await userModel._truncate();
});
jest.mock('../services/helpers/send-email');

const userService = new UserService({ req: { requestId: '' } });
const emailService = new EmailService({ req: { requestId: '' } });
// signUp
describe('user-service.signUp', () => {
  describe('with regular input', () => {
    it('should return desired values without password', async () => {
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

// signIn
describe('user-service.signIn', () => {
  describe('with regular input', () => {
    it('should return desired values without password', async () => {
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
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

// verifyUser
describe('user-service.verifyUser', () => {
  describe('with regular input', () => {
    it('should return user with status: verified', async () => {
      // create user
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      // create mock sib return
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
      // send email and get verify token
      const sendVerifyEmail = await emailService.sendVerifyEmail(newUser);
      const verifyUser = await userService.verifyEmail(sendVerifyEmail.token);
      // make sure the user to be verified
      const expectedResult = {
        status: statusMap.active,
      };
      expect(verifyUser).toMatchObject(expectedResult);
    });
  });
  describe('with wrong token', () => {
    it('should return error: invalidToken', async () => {
      // create user
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      // create mock sib return
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
      // send email and get verify token
      const sendVerifyEmail = await emailService.sendVerifyEmail(newUser);
      // use fake token
      const wrongToken = {
        ...sendVerifyEmail,
        token: 'xxx',
      };
      try {
        await userService.verifyEmail(wrongToken.token);
      } catch (e) {
        // make sure get the right err code
        expect(e.code).toBe(verifyErrorMap.invalidToken.code);
      }
    });
  });
});
