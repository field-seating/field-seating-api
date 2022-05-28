const fs = require('fs');
const { parse } = require('csv-parse/sync');
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
  const fieldModel = new FieldModel();
  const levelModel = new LevelModel();
  const orientationModel = new OrientationModel();
  const zoneModel = new ZoneModel();
  const spaceModel = new SpaceModel();

  // create field
  await Promise.all(
    fieldData.fields.map(async (fieldName) => {
      await fieldModel.createField(fieldName);
    })
  );

  // create orientation
  await Promise.all(
    fieldData.orientations.map(async (orientationName) => {
      await orientationModel.createOrientation(orientationName);
    })
  );

  // create level
  await Promise.all(
    fieldData.levels.map(async (levelName) => {
      await levelModel.createLevel(levelName);
    })
  );

  // create zone
  let fieldMap = new Map();
  let orientationMap = new Map();
  let levelMap = new Map();
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
      await zoneModel.createZone(fieldId, orientationId, levelId, zone.name); // create
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
      await spaceModel.createSpace(
        zoneId,
        space.spaceType,
        space.version,
        space.colNumber,
        space.rowNumber
      );
    })
  );
}

seeding();
