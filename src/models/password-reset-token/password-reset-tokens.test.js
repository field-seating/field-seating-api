const PasswordResetTokenModel = require('./');
const prisma = require('../../config/prisma');
const { stateMap } = require('./constants');
const UserModel = require('../user');

afterEach(async () => {
  const passwordResetTokenModel = new PasswordResetTokenModel();
  await passwordResetTokenModel._truncate();

  const userModel = new UserModel();
  await userModel._truncate();
});

describe('createAndInvalidateOthers', () => {
  it('should remain one valid token only after few operation', async () => {
    const userModel = new UserModel();
    const user = await userModel.createUser({
      email: '',
      name: '1',
      password: '',
    });
    const userId = user.id;

    const lastToken = 'xxoo';

    const passwordResetTokenModel = new PasswordResetTokenModel();

    await passwordResetTokenModel.createAndInvalidateOthers(
      userId,
      'firstToken'
    );
    await passwordResetTokenModel.createAndInvalidateOthers(
      userId,
      'secondToken'
    );
    await passwordResetTokenModel.createAndInvalidateOthers(
      userId,
      'thirdToken'
    );
    await passwordResetTokenModel.createAndInvalidateOthers(userId, lastToken);

    const totalValid = await prisma.passwordResetTokens.count({
      where: {
        userId,
        state: stateMap.valid,
      },
    });

    const firstValidToken = await prisma.passwordResetTokens.findFirst({
      where: {
        userId,
        state: stateMap.valid,
      },
    });

    expect(totalValid).toBe(1);
    expect(firstValidToken.token).toBe(lastToken);
  });
});
