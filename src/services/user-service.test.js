const userServices = require('./user-service');
const UserModel = require('../models/user');
const signUpErrorMap = require('../errors/sign-up-error');

afterEach(async () => {
  const userModel = new UserModel();
  await userModel._truncate();
});
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
  describe('token validity', () => {
    it('should return same user', async () => {
      const email = 'example@example.com';
      const newUser = await userServices.signUp('user1', email, 'password1');
      const signInUser = await userServices.signIn(newUser.id);
      const expectedResult = {
        user: newUser,
      };
      expect(signInUser).toMatchObject(expectedResult);
      expect(signInUser.user).not.toHaveProperty('password');
      expect(signInUser).toHaveProperty('token');
    });
  });
});
