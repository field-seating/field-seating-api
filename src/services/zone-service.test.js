const FieldModel = require('../models/field');
const LevelModel = require('../models/level');
const OrientationModel = require('../models/orientation');
const ZoneModel = require('../models/zone');
const SpaceModel = require('../models/space');
const SeatModel = require('../models/seat');
const PillarModel = require('../models/pillar');
const GroupModel = require('../models/group');
const ZoneService = require('./zone-service');

afterEach(async () => {
  const fieldModel = new FieldModel();
  const levelModel = new LevelModel();
  const orientationModel = new OrientationModel();
  const zoneModel = new ZoneModel();
  const spaceModel = new SpaceModel();
  const seatModel = new SeatModel();
  const pillarModel = new PillarModel();
  const groupModel = new GroupModel();
  await groupModel._truncate();
  await pillarModel._truncate();
  await seatModel._truncate();
  await spaceModel._truncate();
  await zoneModel._truncate();
  await orientationModel._truncate();
  await levelModel._truncate();
  await fieldModel._truncate();
});

const zoneService = new ZoneService({
  logger: console,
});

describe('zone-service.getZoneSpaces', () => {
  describe('with regular input', () => {
    it('should return desired values which spaceType is seat', async () => {
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
      await spaceModel.createSpace(
        newZone.id,
        'seat',
        'testVersion',
        1,
        1,
        'rightSeat',
        1,
        1
      );
      await spaceModel.createSpace(
        newZone.id,
        'pillar',
        'testVersion',
        1,
        2,
        'imPillar',
        1,
        2
      );
      await spaceModel.createSpace(
        newZone.id,
        'group',
        'testVersion',
        0,
        0,
        'rightGroup',
        1,
        3
      );

      const spaceList = await zoneService.getZoneSpaces(newZone.id, 'seat');
      const expectedResult = [
        {
          name: 'rightSeat',
          zoneId: newZone.id,
          spaceType: 'seat',
          version: 'testVersion',
          colNumber: 1,
          rowNumber: 1,
          positionColNumber: 1,
          positionRowNumber: 1,
        },
      ];
      expect(spaceList).toMatchObject(expectedResult);
    });
  });
});
