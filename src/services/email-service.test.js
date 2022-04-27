const EmailService = require('./email-service');
const sendEmail = require('../services/helpers/send-email');
const { baseUrl } = require('../config/config');

jest.mock('../services/helpers/send-email');
const emailService = new EmailService({ logger: console });
//  sendVerifyEmail
describe('email-service.sendVerifyEmail', () => {
  describe('with regular input', () => {
    it('should return user and sendEmail info', async () => {
      // create user
      const newUser = {
        name: 'user1',
        email: 'example@example.com',
      };

      const result = await emailService.sendVerifyEmail(newUser);

      // create mock sib return
      sendEmail.mockImplementation(() => {
        return {
          sendEmail: {
            name: 'user1',
            email: 'example@example.com',
            url: `${baseUrl}/verify-email/${result.token}`,
            sibMessage: ['<202204131533.30577521883.1@smtp-relay.mailin.fr>'],
          },
        };
      });
      const expectedTemplate = 'verify-email';
      const expectedMeta = {
        receiverList: [
          {
            email: newUser.email,
            name: newUser.name,
          },
        ],
        subject: '球場坐座帳號驗證信',
      };
      const expectedData = {
        name: newUser.name,
        email: newUser.email,
        url: `${baseUrl}/verify-email/${result.token}`,
      };
      // 確認有呼叫sib
      expect(sendEmail).toHaveBeenCalled();
      // 確認回傳資訊
      expect(sendEmail).toBeCalledWith(
        expectedTemplate,
        expectedMeta,
        expectedData
      );
    });
  });

  describe('with error', () => {
    it('should return the error which as same in sendinblue ', async () => {
      // create user
      const newUser = {
        name: 'user1',
        email: 'example@example.com',
      };
      // create mock error code
      const code = 500;
      // create mock error
      sendEmail.mockImplementation(() => {
        const error = new Error();
        error.status = code;
        throw error;
      });
      try {
        await emailService.sendVerifyEmail(newUser);
      } catch (e) {
        // 確認回傳error與sib回傳的相同
        expect(e.status).toBe(code);
      }
    });
  });
});
