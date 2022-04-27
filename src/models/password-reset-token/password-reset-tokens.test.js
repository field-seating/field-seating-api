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
      email: 'email',
      name: '1',
      password: '',
    });
    const userId = user.id;

    const lastToken = 'xxoo';
    const current = new Date();

    const passwordResetTokenModel = new PasswordResetTokenModel();

    await passwordResetTokenModel.createAndInvalidateOthers(
      userId,
      'firstToken',
      current
    );
    await passwordResetTokenModel.createAndInvalidateOthers(
      userId,
      'secondToken',
      current
    );
    await passwordResetTokenModel.createAndInvalidateOthers(
      userId,
      'thirdToken',
      current
    );
    await passwordResetTokenModel.createAndInvalidateOthers(
      userId,
      lastToken,
      current
    );

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

describe('updateStateByTokenAndSignedAfter', () => {
  describe('with matched valid token', () => {
    it('should return matched count', async () => {
      const userModel = new UserModel();

      const user = await userModel.createUser({
        email: 'email',
        name: '1',
        password: '',
      });
      const user2 = await userModel.createUser({
        email: 'email2',
        name: '2',
        password: '',
      });

      const userId = user.id;
      const userId2 = user2.id;

      const lastToken = 'xxoo';
      const tokenSignedAt = new Date(2022, 1, 1);

      const passwordResetTokenModel = new PasswordResetTokenModel();

      await prisma.passwordResetTokens.create({
        data: {
          user: { connect: { id: userId } },
          token: lastToken,
          tokenSignedAt,
          state: stateMap.valid,
        },
      });

      await prisma.passwordResetTokens.create({
        data: {
          user: { connect: { id: userId2 } },
          token: 'otherToken',
          tokenSignedAt,
          state: stateMap.valid,
        },
      });

      const count =
        await passwordResetTokenModel.updateStateByTokenAndSignedAfter(
          lastToken,
          new Date(2021, 12, 1)
        );

      expect(count).toBe(1);
    });
  });

  describe('with matched invalid token', () => {
    it('should return 0', async () => {
      const userModel = new UserModel();

      const user = await userModel.createUser({
        email: 'email',
        name: '1',
        password: '',
      });

      const userId = user.id;

      const lastToken = 'xxoo';
      const tokenSignedAt = new Date(2022, 1, 1);

      const passwordResetTokenModel = new PasswordResetTokenModel();

      await prisma.passwordResetTokens.create({
        data: {
          user: { connect: { id: userId } },
          token: lastToken,
          tokenSignedAt,
          state: stateMap.invalid,
        },
      });

      await prisma.passwordResetTokens.create({
        data: {
          user: { connect: { id: userId } },
          token: 'otherToken',
          tokenSignedAt,
          state: stateMap.valid,
        },
      });

      const count =
        await passwordResetTokenModel.updateStateByTokenAndSignedAfter(
          lastToken,
          new Date(2021, 12, 1)
        );

      expect(count).toBe(0);
    });
  });

  describe('without matched valid token', () => {
    it('should return 0', async () => {
      const userModel = new UserModel();

      const user = await userModel.createUser({
        email: 'email',
        name: '1',
        password: '',
      });

      const userId = user.id;

      const tokenSignedAt = new Date(2022, 1, 1);

      const passwordResetTokenModel = new PasswordResetTokenModel();

      await prisma.passwordResetTokens.create({
        data: {
          user: { connect: { id: userId } },
          token: 'oneToken',
          tokenSignedAt,
          state: stateMap.valid,
        },
      });

      await prisma.passwordResetTokens.create({
        data: {
          user: { connect: { id: userId } },
          token: 'otherToken',
          tokenSignedAt,
          state: stateMap.valid,
        },
      });

      const count =
        await passwordResetTokenModel.updateStateByTokenAndSignedAfter(
          'two token',
          new Date(2021, 12, 1)
        );

      expect(count).toBe(0);
    });
  });
});
