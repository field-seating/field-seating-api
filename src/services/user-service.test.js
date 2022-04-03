const userServices = require('./user-service');

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
      expect(newUser).toEqual(expectedResult);
    });
  });
});
