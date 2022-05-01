const assert = require('assert/strict');

const PasswordService = require('./');
const UserService = require('../user-service');
const passwordErrorMap = require('../../errors/password-error');
const UserModel = require('../../models/user');
const PasswordRestTokenModel = require('../../models/password-reset-token');
const prisma = require('../../config/prisma');
const { stateMap } = require('../../models/password-reset-token/constants');
const { comparePassword } = require('../../utils/crypto/password');

const passwordService = new PasswordService({ logger: console });
const userService = new UserService({ logger: console });
const userModel = new UserModel();
const passwordResetTokenModel = new PasswordRestTokenModel();

afterEach(async () => {
  await passwordResetTokenModel._truncate();
  await userModel._truncate();
});

describe('recoveryPassword', () => {
  it('should throw error when no email matched', () => {
    const email = 'email';

    assert.rejects(
      async () => {
        await passwordService.recoveryPassword(email);
      },
      {
        code: passwordErrorMap.emailInvalid.code,
      }
    );
  });

  it('should create a passwordResetToken entity', async () => {
    const user = await userModel.createUser({
      email: 'email',
      name: 'name',
      password: 'pwd',
    });

    await passwordService.recoveryPassword(user.email);

    const entities = await prisma.passwordResetTokens.findMany({
      where: {
        userId: user.id,
      },
    });

    expect(entities).toHaveLength(1);
    expect(entities[0].userId).toBe(user.id);
  });
});

describe('updatePassword', () => {
  it('should reset password', async () => {
    const user = await userService.signUp('name', 'email', 'pwd');

    const token = 'token';
    const tokenSignedAt = new Date();

    const newPasswordResetToken = await prisma.passwordResetTokens.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        token,
        tokenSignedAt,
        state: stateMap.valid,
      },
    });

    const newPassword = 'new-password';

    await passwordService.updatePassword(
      newPasswordResetToken.token,
      newPassword
    );

    const newUser = await prisma.users.findUnique({
      where: {
        id: user.id,
      },
    });

    expect(await comparePassword(newPassword, newUser.password)).toBe(true);
  });
});
