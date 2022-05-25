const assert = require('assert/strict');
const PhotoModel = require('../models/photo');
const PhotoService = require('./photo-service');
const FieldModel = require('../models/field');
const LevelModel = require('../models/level');
const OrientationModel = require('../models/orientation');
const ZoneModel = require('../models/zone');
const SpaceModel = require('../models/space/index');
const SeatModel = require('../models/seat');
const UserModel = require('../models/user');
const UserService = require('./user-service');
const postPhotoErrorMap = require('../errors/post-photo-error');
const { resizeImages } = require('../utils/upload-image/resize');
const { uploadS3 } = require('../utils/upload-image/uploadS3');
const { randomHashName } = require('../utils/upload-image/random-hash-name');
jest.mock('../utils/upload-image/resize');
jest.mock('../utils/upload-image/uploadS3');
jest.mock('../utils/upload-image/random-hash-name');

afterEach(async () => {
  const userModel = new UserModel();
  const photoModel = new PhotoModel();
  const fieldModel = new FieldModel();
  const levelModel = new LevelModel();
  const orientationModel = new OrientationModel();
  const zoneModel = new ZoneModel();
  const spaceModel = new SpaceModel();
  const seatModel = new SeatModel();
  await photoModel._truncate();
  await seatModel._truncate();
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
    it('should return desired values with url', async () => {
      // create user
      const name = 'testPhoto';
      const email = 'testphoto@example.com';
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
        'seat',
        'testVersion',
        '1',
        '1'
      );

      // creat file
      const file = [
        {
          fieldname: 'images',
          originalname: 'test.jpeg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('whatever'),
        },
      ];
      const uniqueKey = 'testReqId';
      const userId = newUser.id;
      const spaceId = newSpace.id;
      const dateTime = new Date();

      // mock utils
      randomHashName.mockImplementation(() => {
        return 'testPath';
      });
      resizeImages.mockImplementation(() => {
        return [
          {
            data: Buffer.from('whatever'),
            info: {
              format: 'jpeg',
              width: 3200,
              height: 3200,
              channels: 3,
              premultiplied: false,
              size: 743823,
            },
            filename: 'testPath',
          },
        ];
      });
      uploadS3.mockImplementation(() => {
        return true;
      });

      // create photo
      const newPhoto = await photoService.postPhotos(
        spaceId,
        file,
        uniqueKey,
        userId,
        dateTime
      );
      const expectedResult = [
        {
          spaceId,
        },
      ];
      expect(newPhoto).toMatchObject(expectedResult);
      expect(newPhoto[0]).toHaveProperty('url');
    });
  });

  describe('with not existed space', () => {
    it('should return wrongSpaceId error', async () => {
      // create user
      const name = 'testPhoto';
      const email = 'testPhoto@example.com';
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
        'seat',
        'testVersion',
        '1',
        '1'
      );

      // creat file
      const file = [
        {
          fieldname: 'images',
          originalname: 'test.jpeg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('whatever'),
        },
      ];
      const uniqueKey = 'testReqId';
      const userId = newUser.id;
      // wrong space id
      const spaceId = newSpace.id + 1;
      const dateTime = new Date();

      // mock utils
      randomHashName.mockImplementation(() => {
        return 'testPath';
      });
      resizeImages.mockImplementation(() => {
        return [
          {
            data: Buffer.from('whatever'),
            info: {
              format: 'jpeg',
              width: 3200,
              height: 3200,
              channels: 3,
              premultiplied: false,
              size: 743823,
            },
            filename: 'testPath',
          },
        ];
      });
      uploadS3.mockImplementation(() => {
        return true;
      });

      // create photo
      assert.rejects(
        async () => {
          await photoService.postPhotos(
            spaceId,
            file,
            uniqueKey,
            userId,
            dateTime
          );
        },
        {
          code: postPhotoErrorMap.wrongSpaceId.code,
        }
      );
    });
  });

  describe('with duplicate path', () => {
    it('should return duplicatePath error', async () => {
      // create user
      const name = 'testPhoto';
      const email = 'testPhoto@example.com';
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
        'seat',
        'testVersion',
        '1',
        '1'
      );

      // creat file
      const file = [
        {
          fieldname: 'images',
          originalname: 'test.jpeg',
          encoding: '7bit',
          mimetype: 'image/jpeg',
          buffer: Buffer.from('whatever'),
        },
      ];
      const uniqueKey = 'testReqId';
      const userId = newUser.id;
      const spaceId = newSpace.id;
      const dateTime = new Date();

      // mock utils
      randomHashName.mockImplementation(() => {
        return 'duplicatePath';
      });
      resizeImages.mockImplementation(() => {
        return [
          {
            data: Buffer.from('whatever'),
            info: {
              format: 'jpeg',
              width: 3200,
              height: 3200,
              channels: 3,
              premultiplied: false,
              size: 743823,
            },
            filename: 'duplicatePath',
          },
        ];
      });
      uploadS3.mockImplementation(() => {
        return true;
      });

      // create photo
      await assert.rejects(
        async () => {
          await photoService.postPhotos(
            spaceId,
            file,
            uniqueKey,
            userId,
            dateTime
          );
          await photoService.postPhotos(
            spaceId,
            file,
            uniqueKey,
            userId,
            dateTime
          );
        },
        {
          code: postPhotoErrorMap.duplicatePath.code,
        }
      );
    });
  });
});
