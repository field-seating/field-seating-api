const assert = require('assert/strict');

const PasswordService = require('./');
const passwordErrorMap = require('../../errors/password-error');
const UserModel = require('../../models/user');
const PasswordRestTokenModel = require('../../models/password-reset-token');
const prisma = require('../../config/prisma');

const passwordService = new PasswordService({ logger: console });
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
