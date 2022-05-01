const assert = require('assert/strict');

const PasswordService = require('./');
const passwordErrorMap = require('../../errors/password-error');

const passwordService = new PasswordService({ logger: console });

describe('password-service', () => {
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
});
