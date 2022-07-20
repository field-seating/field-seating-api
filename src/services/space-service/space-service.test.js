const UserModel = require('../../models/user');
const FieldModel = require('../../models/field');
const LevelModel = require('../../models/level');
const OrientationModel = require('../../models/orientation');
const ZoneModel = require('../../models/zone');
const SeatModel = require('../../models/seat');
const SpaceModel = require('../../models/space');
const PhotoModel = require('../../models/photo');

const { sortMap, orderMap } = require('./constant');
const { paginationLimitMap } = require('../../constants/pagination-constant');
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
    it('should return photos order by date and pagination', async () => {
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
      const sort = sortMap.date;
      const order = orderMap.desc;
      const limit = paginationLimitMap.photos;
      const cursorId = null;
      const paginationOption = {
        sort,
        order,
        limit,
        cursorId,
      };
      const photos = await spaceService.getPhotosBySpace(
        spaceId,
        paginationOption
      );
      expect(photos.photos[0]).toMatchObject(expectedResult);
      expect(photos.photos[0]).toHaveProperty('netUsefulCount');
      expect(photos.photos[0]).toHaveProperty('dataset');
      expect(photos).toHaveProperty('pagination');
      expect(photos.pagination).toHaveProperty('cursorId');
    });
  });
});

describe('space-service.getSpace', () => {
  it('should return zone and field info', async () => {
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
      1,
      1,
      'rightSeat',
      1,
      1
    );
    const space = await spaceService.getSpace(newSpace.id);

    console.log('space', space);

    expect(space.zone.id).toBe(newZone.id);
    expect(space.zone.field.id).toBe(newField.id);
  });
});
