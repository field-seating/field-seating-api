const fs = require('fs');
const { parse } = require('csv-parse/sync');
const data = require('../seeders/data.json');
const FieldModel = require('../src/models/field');
const LevelModel = require('../src/models/level');
const OrientationModel = require('../src/models/orientation');
const ZoneModel = require('../src/models/zone');
const SpaceModel = require('../src/models/space/index');

// csv read
async function readCsv() {
  const fileContent = await fs.promises.readFile('./seeders/spaces/westAB.csv');
  const data = parse(fileContent, { columns: true });
  return data;
}

async function seeding() {
  const fieldModel = new FieldModel();
  const levelModel = new LevelModel();
  const orientationModel = new OrientationModel();
  const zoneModel = new ZoneModel();
  const spaceModel = new SpaceModel();
  await fieldModel.createField(data.field);
  await Promise.all(
    data.orientations.map(async (orientation) => {
      await orientationModel.createOrientation(orientation);
    })
  );
  await Promise.all(
    data.levels.map(async (level) => {
      await levelModel.createLevel(level);
    })
  );
  await Promise.all(
    data.zones.map(async (zone) => {
      const field = await fieldModel.searchField(zone.field);
      const orientation = await orientationModel.searchOrientation(
        zone.orientation
      );
      const level = await levelModel.searchLevel(zone.level);
      await zoneModel.createZone(field.id, orientation.id, level.id, zone.name);
    })
  );
  const spacesData = await readCsv();
  const spacesOfField = await fieldModel.searchField(spacesData[0].field);
  await Promise.all(
    spacesData.map(async (space) => {
      const zone = await zoneModel.searchZone(spacesOfField.id, space.zone);
      await spaceModel.createSpace(
        zone[0].id,
        space.spaceType,
        space.version,
        space.colNumber,
        space.rowNumber
      );
    })
  );
}

seeding();
