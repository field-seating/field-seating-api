const userServices = require('./user-service');
const UserModel = require('../models/user');

afterEach(async () => {
  const userModel = new UserModel();
  await userModel._truncate();
});

describe('user-service.signUp', () => {
  describe('with regular input', () => {
    it('should return desired data', async () => {
      const name = 'user1';
      const email = 'example@example.com';
      const password = 'qwerasdf';

      const newUser = await userServices.signUp(name, email, password);
      const expectedResult = {
        name,
        email,
      };
      expect(newUser).toMatchObject(expectedResult);
    });
  });
});
