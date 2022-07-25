const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { PromisePool } = require('@supercharge/promise-pool');

const logger = require('../src/config/logger');

const fieldData = require('../seeders/data.json'); // data of field (include field, orientation, level, zone)
const FieldModel = require('../src/models/field');
const LevelModel = require('../src/models/level');
const OrientationModel = require('../src/models/orientation');
const ZoneModel = require('../src/models/zone');
const SpaceModel = require('../src/models/space/index');

// csv read
async function getSpacesData() {
  const files = await fs.promises.readdir('./seeders/space-data');
  let data = [];
  for (let file of files) {
    const fileContent = await fs.promises.readFile(
      `./seeders/space-data/${file}`
    ); // data of space
    const content = parse(fileContent, { columns: true });
    data = data.concat(content);
  }
  return data;
}

async function seeding() {
  logger.info('start to seed the data');

  const fieldModel = new FieldModel();
  const levelModel = new LevelModel();
  const orientationModel = new OrientationModel();
  const zoneModel = new ZoneModel();
  const spaceModel = new SpaceModel();

  const orientationMap = new Map();
  const levelMap = new Map();
  const zoneMap = new Map();

  // create orientation
  await PromisePool.withConcurrency(10)
    .for(fieldData.orientations)
    .process(async (orientationName) => {
      const newOrientation = await orientationModel.createOrientation(
        orientationName
      );

      orientationMap.set(orientationName, newOrientation.id);
    });

  // create level
  await PromisePool.withConcurrency(10)
    .for(fieldData.levels)
    .process(async (levelName) => {
      const newLevel = await levelModel.createLevel(levelName);

      levelMap.set(levelName, newLevel.id);
    });

  // create field
  await PromisePool.withConcurrency(10)
    .for(fieldData.fields)
    .process(async (fieldName) => {
      // get orientations id which this field have
      const orientationIds = await Promise.all(
        fieldName.orientations.map(async (orientationName) => {
          if (!orientationMap.has(orientationName)) {
            const orientation = await orientationModel.getOrientationByName(
              orientationName
            );
            orientationMap.set(orientationName, orientation.id);
          }
          return orientationMap.get(orientationName);
        })
      );

      // get levels id id which this field have
      const levelIds = await Promise.all(
        fieldName.levels.map(async (levelName) => {
          // if levelId never get
          if (!levelMap.has(levelName)) {
            const level = await levelModel.getLevelByName(levelName);
            levelMap.set(levelName, level.id);
          }
          return levelMap.get(levelName);
        })
      );

      // create field and the mm relationship with level and orientation
      await fieldModel.createField(
        fieldName.name,
        fieldName.img,
        orientationIds,
        levelIds
      );
    });

  // create zone
  let fieldMap = new Map();
  await PromisePool.withConcurrency(10)
    .for(fieldData.zones)
    .process(async (zone) => {
      // if fieldId never get
      if (!fieldMap.has(zone.field)) {
        const field = await fieldModel.getFieldByName(zone.field);
        fieldMap.set(zone.field, field.id);
      }
      const fieldId = fieldMap.get(zone.field);

      // if orientationId never get
      if (!orientationMap.has(zone.orientation)) {
        const orientation = await orientationModel.getOrientationByName(
          zone.orientation
        );
        orientationMap.set(zone.orientation, orientation.id);
      }
      const orientationId = orientationMap.get(zone.orientation);

      // if levelId never get
      if (!levelMap.has(zone.level)) {
        const level = await levelModel.getLevelByName(zone.level);
        levelMap.set(zone.level, level.id);
      }
      const levelId = levelMap.get(zone.level);
      const newZone = await zoneModel.createZone(
        fieldId,
        orientationId,
        levelId,
        zone.name
      );
      zoneMap.set(zone.name, newZone.id);
    });

  // create space
  const spacesData = await getSpacesData();
  await PromisePool.withConcurrency(10)
    .for(spacesData)
    .process(async (space) => {
      // if fieldId never get
      if (!fieldMap.has(space.field)) {
        logger.debug('get field while creating space');
        const field = await fieldModel.getFieldByName(space.field);
        fieldMap.set(space.field, field.id);
      }
      const fieldId = fieldMap.get(space.field);

      // if zoneId never get
      if (!zoneMap.has(space.zone)) {
        logger.debug('get zone while creating space');
        const zone = await zoneModel.getZoneByName(fieldId, space.zone);
        zoneMap.set(space.zone, zone[0].id);
      }
      const zoneId = zoneMap.get(space.zone);

      // create
      await spaceModel.createSpace(
        zoneId,
        space.spaceType,
        space.version,
        Number(space.colNumber),
        Number(space.rowNumber),
        space.name,
        Number(space.positionColNumber),
        Number(space.positionRowNumber)
      );
    });

  logger.info('the seeding job is successful');
}

seeding();
