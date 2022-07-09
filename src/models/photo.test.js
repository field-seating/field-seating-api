const { isEmpty } = require('ramda');
const PhotoModel = require('./photo');
const FieldModel = require('./field');
const LevelModel = require('./level');
const OrientationModel = require('./orientation');
const ZoneModel = require('./zone');
const SpaceModel = require('./space');
const SeatModel = require('./seat');
const UserModel = require('./user');
const UserService = require('../services/user-service');

afterEach(async () => {
  const userModel = new UserModel();
  const photoModel = new PhotoModel();
  const fieldModel = new FieldModel();
  const levelModel = new LevelModel();
  const orientationModel = new OrientationModel();
  const zoneModel = new ZoneModel();
  const seatModel = new SeatModel();
  const spaceModel = new SpaceModel();
  await photoModel._truncate();
  await seatModel._truncate();
  await spaceModel._truncate();
  await zoneModel._truncate();
  await orientationModel._truncate();
  await levelModel._truncate();
  await fieldModel._truncate();
  await userModel._truncate();
});

describe('photo-model.getPhotos', () => {
  describe('with bug take', () => {
    it('should return wrong photo data', async () => {
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

      // create and verify user
      const userService = new UserService({
        logger: console,
      });
      const email = 'example@example.com';
      const newUser = await userService.signUp('user1', email, 'password1');
      await userService.verifyEmail(newUser.verificationToken);

      // create test photo data
      const userId = newUser.id;
      const spaceId = newSpace.id;
      const photoModel = new PhotoModel();

      await photoModel.createPhoto(
        'starPhoto',
        userId,
        spaceId,
        new Date('2022-08-30')
      );

      await photoModel.createPhoto(
        'photoTwo',
        userId,
        spaceId,
        new Date('2022-07-30')
      );

      await photoModel.createPhoto(
        'photoThree',
        userId,
        spaceId,
        new Date('2022-06-30')
      );
      await photoModel.createPhoto(
        'photoFour',
        userId,
        spaceId,
        new Date('2022-06-30')
      );
      await photoModel.createPhoto(
        'photoFive',
        userId,
        spaceId,
        new Date('2022-06-30')
      );
      await photoModel.createPhoto(
        'photoSix',
        userId,
        spaceId,
        new Date('2022-05-30')
      );
      // if photo data stop build here is will be ok even limit is 4
      await photoModel.createPhoto(
        'photoSeven',
        userId,
        spaceId,
        new Date('2022-06-30')
      );
      await photoModel.createPhoto(
        'photoEight',
        userId,
        spaceId,
        new Date('2022-06-30')
      );
      await photoModel.createPhoto(
        'photoNine',
        userId,
        spaceId,
        new Date('2022-06-30')
      );
      await photoModel.createPhoto(
        'photoTen',
        userId,
        spaceId,
        new Date('2022-06-30')
      );
      await photoModel.createPhoto(
        'photoEleven',
        userId,
        spaceId,
        new Date('2022-06-30')
      );

      // getPhotos
      const limit = 5; // change 5 will be ok
      const allLimit = 100;

      // get expected photos data
      const allPhotos = await photoModel.getPhotos(allLimit);
      console.log(allPhotos);

      // limit query photos data
      const photos = await photoModel.getPhotos(limit);
      console.log(photos);

      const photosSecond = await photoModel.getPhotos(limit, photos.cursorId);
      console.log(photosSecond);

      const photosThird = await photoModel.getPhotos(
        limit,
        photosSecond.cursorId
      );
      console.log(photosThird);

      if (
        isEmpty(
          photos.data.filter((photo) => photo.id === allPhotos.data[2].id)
        ) &&
        isEmpty(
          isEmpty(photosThird)
            ? []
            : photosSecond.data.filter(
                (photo) => photo.id === allPhotos.data[2].id
              )
        ) &&
        isEmpty(
          isEmpty(photosThird)
            ? []
            : photosThird.data.filter(
                (photo) => photo.id === allPhotos.data[2].id
              )
        )
      ) {
        console.log('some data not found in photos queries');
      }

      expect(photos.data).toHaveLength(limit);
      expect(photos.data[0]).toMatchObject(allPhotos.data[0]);
      expect(photos.data[1]).toMatchObject(allPhotos.data[1]);
      expect(photos.data[2]).toMatchObject(allPhotos.data[2]);
      expect(photos.data[3]).toMatchObject(allPhotos.data[3]);
      expect(photos).toHaveProperty('cursorId');
    });
  });
});
