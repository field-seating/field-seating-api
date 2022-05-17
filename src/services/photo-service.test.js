// const assert = require('assert/strict');
const PhotoModel = require('../models/photo');
const PhotoService = require('./photo-service');
const FieldModel = require('../models/field');
const LevelModel = require('../models/level');
const OrientationModel = require('../models/orientation');
const ZoneModel = require('../models/zone');
const SpaceModel = require('../models/space');
const UserModel = require('../models/user');
const UserService = require('./user-service');

afterEach(async () => {
  const userModel = new UserModel();
  const photoModel = new PhotoModel();
  const fieldModel = new FieldModel();
  const levelModel = new LevelModel();
  const orientationModel = new OrientationModel();
  const zoneModel = new ZoneModel();
  const spaceModel = new SpaceModel();
  await photoModel._truncate();
  await spaceModel._truncate();
  await zoneModel._truncate();
  await orientationModel._truncate();
  await levelModel._truncate();
  await fieldModel._truncate();
  await userModel._truncate();
});

const userService = new UserService({
  logger: console,
});
const photoService = new PhotoService({
  logger: console,
});

describe('photo-service.postPhoto', () => {
  describe('with regular input', () => {
    it('should return desired values', async () => {
      // create user
      const name = 'userPhoto';
      const email = 'examplephoto@example.com';
      const password = 'qwerasdf';
      const newUser = await userService.signUp(name, email, password);

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
      const newSpace = await spaceModel.createSpace(
        newZone.id,
        'testType',
        'testVersion',
        '1',
        '1'
      );

      // creat photo
      const filename = 'testFile1';
      const userId = newUser.id;
      const spaceId = newSpace.id;
      const dateTime = new Date();
      const newPhoto = await photoService.postPhotos(
        filename,
        userId,
        spaceId,
        dateTime
      );
      const expectedResult = {
        spaceId,
        path: filename,
      };

      expect(newPhoto).toMatchObject(expectedResult);
    });
  });
});
