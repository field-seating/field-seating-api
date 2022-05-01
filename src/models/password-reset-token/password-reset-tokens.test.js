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

    const entity = await passwordResetTokenModel.createAndInvalidateOthers(
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

    expect(entity.token).toBe(lastToken);
    expect(totalValid).toBe(1);
    expect(firstValidToken.token).toBe(lastToken);
  });
});

describe('deactivateByTokenAndSignedAfter', () => {
  describe('with matched valid token', () => {
    it('should return first valid token', async () => {
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

      const token = 'xxoo';
      const tokenSignedAt = new Date(2022, 1, 1);

      const passwordResetTokenModel = new PasswordResetTokenModel();

      const entity = await prisma.passwordResetTokens.create({
        data: {
          user: { connect: { id: userId } },
          token,
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

      const newEntity =
        await passwordResetTokenModel.deactivateByTokenAndSignedAfter(
          token,
          new Date(2021, 12, 1)
        );

      expect(newEntity.id).toBe(entity.id);
    });
  });

  describe('with matched invalid token', () => {
    it('should return null', async () => {
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

      const entity =
        await passwordResetTokenModel.deactivateByTokenAndSignedAfter(
          lastToken,
          new Date(2021, 12, 1)
        );

      expect(entity).toBe(null);
    });
  });

  describe('without matched valid token', () => {
    it('should return null', async () => {
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

      const entity =
        await passwordResetTokenModel.deactivateByTokenAndSignedAfter(
          'two token',
          new Date(2021, 12, 1)
        );

      expect(entity).toBe(null);
    });
  });
});
