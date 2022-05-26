const fs = require('fs');
const { parse } = require('csv-parse/sync');
const data = require('../seeders/data.json'); // data of field (include field, orientation, level, zone)
const FieldModel = require('../src/models/field');
const LevelModel = require('../src/models/level');
const OrientationModel = require('../src/models/orientation');
const ZoneModel = require('../src/models/zone');
const SpaceModel = require('../src/models/space/index');

// csv read
async function readCsv() {
  const fileContent = await fs.promises.readFile('./seeders/spaces/westAB.csv'); // data of space
  const data = parse(fileContent, { columns: true });
  return data;
}

async function seeding() {
  const fieldModel = new FieldModel();
  const levelModel = new LevelModel();
  const orientationModel = new OrientationModel();
  const zoneModel = new ZoneModel();
  const spaceModel = new SpaceModel();

  // create field
  await fieldModel.createField(data.field);

  // create orientation
  await Promise.all(
    data.orientations.map(async (orientation) => {
      await orientationModel.createOrientation(orientation);
    })
  );

  // create level
  await Promise.all(
    data.levels.map(async (level) => {
      await levelModel.createLevel(level);
    })
  );

  // create zone
  let fieldMap = new Map();
  let orientationMap = new Map();
  let levelMap = new Map();
  await Promise.all(
    data.zones.map(async (zone) => {
      // if fieldId never got searched
      if (!fieldMap.has(zone.field)) {
        const field = await fieldModel.searchField(zone.field);
        fieldMap.set(zone.field, field.id);
      }
      const fieldId = await fieldMap.get(zone.field);

      // if orientationId never got searched
      if (!orientationMap.has(zone.orientation)) {
        const orientation = await orientationModel.searchOrientation(
          zone.orientation
        );
        orientationMap.set(zone.orientation, orientation.id);
      }
      const orientationId = await orientationMap.get(zone.orientation);

      // if levelId never got searched
      if (!levelMap.has(zone.level)) {
        const level = await levelModel.searchLevel(zone.level);
        levelMap.set(zone.level, level.id);
      }
      const levelId = await levelMap.get(zone.level);
      await zoneModel.createZone(fieldId, orientationId, levelId, zone.name); // create
    })
  );

  // create space
  const spacesData = await readCsv();
  let zoneMap = new Map();
  await Promise.all(
    spacesData.map(async (space) => {
      // if fieldId never got searched
      if (!fieldMap.has(space.field)) {
        const field = await fieldModel.searchField(space.field);
        fieldMap.set(space.field, field.id);
      }
      const fieldId = await fieldMap.get(space.field);

      // if zoneId never got searched
      if (!zoneMap.has(space.zone)) {
        const zone = await zoneModel.searchZone(fieldId, space.zone);
        console.log(zone);
        zoneMap.set(space.zone, zone[0].id);
      }
      const zoneId = await zoneMap.get(space.zone);

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
