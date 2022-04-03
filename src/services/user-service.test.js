const userServices = require('./user-service');
const UserModel = require('../models/user');
const signUpErrorMap = require('../errors/signUpError');

afterEach(async () => {
  const userModel = new UserModel();
  await userModel._truncate();
});

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
