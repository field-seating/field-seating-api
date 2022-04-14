const emailServices = require('./email-service');
const UserService = require('./user-service');
const UserModel = require('../models/user');
const sendEmail = require('../controllers/helpers/send-email');

afterEach(async () => {
  const userModel = new UserModel();
  await userModel._truncate();
});
jest.mock('../controllers/helpers/send-email');

const userService = new UserService({ req: { requestId: '' } });
//  sendVerifyEmail
describe('email-service.sendVerifyEmail', () => {
  describe('with regular input', () => {
    it('should return user and sendEmail info', async () => {
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
      const result = await emailServices.sendVerifyEmail(newUser);
      const expectedResult = {
        email: newUser.email,
        name: newUser.name,
      };
      // 確認有呼叫sib
      expect(sendEmail).toHaveBeenCalled();
      // 確認回傳資訊
      expect(result.sendEmail).toMatchObject(expectedResult);
      expect(result.sendEmail).toHaveProperty(
        'name',
        'email',
        'url',
        'sibMessage'
      );
    });
  });

  describe('with error', () => {
    it('should return the error which as same in sendinblue ', async () => {
      // create user
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      // create mock error code
      const code = 500;
      // create mock error
      sendEmail.mockImplementation(() => {
        const error = new Error();
        error.status = code;
        throw error;
      });
      try {
        await emailServices.sendVerifyEmail(newUser);
      } catch (e) {
        // 確認回傳error與sib回傳的相同
        expect(e.code).toBe(code);
      }
    });
  });
});
