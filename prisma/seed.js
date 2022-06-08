const fs = require('fs');
const { parse } = require('csv-parse/sync');
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

  // create orientation
  await Promise.all(
    fieldData.orientations.map(async (orientationName) => {
      await orientationModel.findOrCreateOrientation(orientationName);
    })
  );

  // create level
  await Promise.all(
    fieldData.levels.map(async (levelName) => {
      await levelModel.findOrCreateLevel(levelName);
    })
  );

  // create field
  let orientationMap = new Map();
  let levelMap = new Map();
  await Promise.all(
    fieldData.fields.map(async (fieldName) => {
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
      await fieldModel.findOrCreateField(
        fieldName.name,
        fieldName.img,
        orientationIds,
        levelIds
      );
    })
  );

  // create zone
  let fieldMap = new Map();
  await Promise.all(
    fieldData.zones.map(async (zone) => {
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
      await zoneModel.findOrCreateZone(
        fieldId,
        orientationId,
        levelId,
        zone.name
      ); // create
    })
  );

  // create space
  const spacesData = await getSpacesData();
  let zoneMap = new Map();
  await Promise.all(
    spacesData.map(async (space) => {
      // if fieldId never get
      if (!fieldMap.has(space.field)) {
        const field = await fieldModel.getFieldByName(space.field);
        fieldMap.set(space.field, field.id);
      }
      const fieldId = fieldMap.get(space.field);

      // if zoneId never get
      if (!zoneMap.has(space.zone)) {
        const zone = await zoneModel.getZoneByName(fieldId, space.zone);
        zoneMap.set(space.zone, zone[0].id);
      }
      const zoneId = zoneMap.get(space.zone);

      // create
      await spaceModel.findOrCreateSpace(
        zoneId,
        space.spaceType,
        space.version,
        Number(space.colNumber),
        Number(space.rowNumber),
        space.name,
        Number(space.positionColNumber),
        Number(space.positionRowNumber)
      );
    })
  );

  logger.info('the seeding job is successful');
}

seeding();
