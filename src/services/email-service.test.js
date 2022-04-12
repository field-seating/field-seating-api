// const emailServices = require('./email-service');
// const UserModel = require('../models/user');
// const signUpErrorMap = require('../errors/sign-up-error');

// afterEach(async () => {
//   const userModel = new UserModel();
//   await userModel._truncate();
// });
// // signIn
// describe('email-service.sendVerifyEmail', () => {
//   describe('with regular input', () => {
//     it('should return desired values without password', async () => {
//       const email = 'example@example.com';
//       const newUser = await userServices.signUp('user1', email, 'password1');
//       const expectedResult = {
//         user: newUser,
//       };
//       const signInUser = await userServices.signIn(newUser.id);
//       expect(signInUser).toMatchObject(expectedResult);
//       expect(signInUser.user).not.toHaveProperty('password');
//       expect(signInUser).toHaveProperty('token');
//     });
//   });
// });
