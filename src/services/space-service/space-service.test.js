const assert = require('assert/strict');
const UserModel = require('../../models/user');
const FieldModel = require('../../models/field');
const LevelModel = require('../../models/level');
const OrientationModel = require('../../models/orientation');
const ZoneModel = require('../../models/zone');
const SeatModel = require('../../models/seat');
const SpaceModel = require('../../models/space');
const PhotoModel = require('../../models/photo');
const getPhotoErrorMap = require('../../errors/get-photo-error');
const { sortMap, orderMap } = require('./constant');
const SpaceService = require('./index');
const UserService = require('../user-service');

afterEach(async () => {
  const userModel = new UserModel();
  const fieldModel = new FieldModel();
  const levelModel = new LevelModel();
  const orientationModel = new OrientationModel();
  const zoneModel = new ZoneModel();
  const spaceModel = new SpaceModel();
  const seatModel = new SeatModel();
  const photoModel = new PhotoModel();
  await photoModel._truncate();
  await seatModel._truncate();
  await spaceModel._truncate();
  await zoneModel._truncate();
  await orientationModel._truncate();
  await levelModel._truncate();
  await fieldModel._truncate();
  await userModel._truncate();
});

const spaceService = new SpaceService({
  logger: console,
});

describe('space-service.getPhotosBySpace', () => {
  describe('with regular input', () => {
    it('should return photos order by date', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const correctSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        'rightSeat',
        1,
        1
      );

      // create and verify user
      const userService = new UserService({
        logger: console,
      });
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      await userService.verifyEmail(newUser.verificationToken);

      // create test photo data
      const path = 'testPhotoPath';
      const userId = newUser.id;
      const spaceId = correctSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        new Date('2022-06-30')
      );
      const latestPhoto = await photoModel.createPhoto(
        `${path}1`,
        userId,
        spaceId,
        dateTime
      );
      const expectedResult = {
        id: latestPhoto.id,
        user: { id: newUser.id, name: newUser.name },
        spaceId,
      };

      // getSpacePhotos
      const photos = await spaceService.getPhotosBySpace(
        spaceId,
        sortMap.date,
        orderMap.desc
      );
      expect(photos[0]).toMatchObject(expectedResult);
      expect(photos[0]).toHaveProperty('netUsefulCount');
      expect(photos[0]).toHaveProperty('dataset');
    });
  });
  describe('with not existed spaceId', () => {
    it('should return spaceNotFound error', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const correctSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        'rightSeat',
        1,
        1
      );

      // create and verify user
      const userService = new UserService({
        logger: console,
      });
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      await userService.verifyEmail(newUser.verificationToken);

      // create test photo data
      const path = 'testPhotoPath';
      const userId = newUser.id;
      const spaceId = correctSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      await photoModel.createPhoto(path, userId, spaceId, dateTime);

      // getSpacePhotos
      const wrongSpaceId = Number(spaceId) + 999;
      assert.rejects(
        async () => {
          await spaceService.getPhotosBySpace(
            wrongSpaceId,
            sortMap.date,
            orderMap.desc
          );
        },
        {
          code: getPhotoErrorMap.spaceNotFound.code,
        }
      );
    });
  });
});

describe('space-service.getOtherPhotosBySpace', () => {
  describe('with regular input', () => {
    it('should return photos order by date', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const correctSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        'rightSeat',
        1,
        1
      );

      // create and verify user
      const userService = new UserService({
        logger: console,
      });
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      await userService.verifyEmail(newUser.verificationToken);

      // create test photo data
      const path = 'testPhotoPath';
      const userId = newUser.id;
      const spaceId = correctSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const excludePhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        new Date('2021-06-30')
      );
      const otherPhoto = await photoModel.createPhoto(
        `${path}other`,
        userId,
        spaceId,
        dateTime
      );
      const expectedResult = {
        id: otherPhoto.id,
        user: { id: newUser.id, name: newUser.name },
        spaceId,
      };

      // getSpacePhotos
      const photos = await spaceService.getOtherPhotosBySpace(
        spaceId,
        excludePhoto.id
      );
      expect(photos[0]).toMatchObject(expectedResult);
      expect(photos[0]).toHaveProperty('netUsefulCount');
      expect(photos[0]).toHaveProperty('dataset');
    });
  });
  describe('with not existed spaceId', () => {
    it('should return spaceNotFound error', async () => {
      // create space
      const fieldModel = new FieldModel();
      const levelModel = new LevelModel();
      const orientationModel = new OrientationModel();
      const zoneModel = new ZoneModel();
      const spaceModel = new SpaceModel();

      const newField = await fieldModel.createField('testField', '');
      const newLevel = await levelModel.createLevel('testLevel');
      const newOrientation = await orientationModel.createOrientation(
        'testOrientation'
      );
      const newZone = await zoneModel.createZone(
        newField.id,
        newOrientation.id,
        newLevel.id,
        'testZone'
      );
      const correctSpace = await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        'rightSeat',
        1,
        1
      );

      // create and verify user
      const userService = new UserService({
        logger: console,
      });
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      await userService.verifyEmail(newUser.verificationToken);

      // create test photo data
      const path = 'testPhotoPath';
      const userId = newUser.id;
      const spaceId = correctSpace.id;
      const dateTime = new Date();
      const photoModel = new PhotoModel();
      const excludePhoto = await photoModel.createPhoto(
        path,
        userId,
        spaceId,
        dateTime
      );

      // getSpacePhotos
      const wrongSpaceId = Number(spaceId) + 999;
      assert.rejects(
        async () => {
          await spaceService.getOtherPhotosBySpace(
            wrongSpaceId,
            excludePhoto.id
          );
        },
        {
          code: getPhotoErrorMap.spaceNotFound.code,
        }
      );
    });
  });
});
