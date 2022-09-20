const fs = require('fs');
const path = require('path');
const { isNil } = require('ramda');
const { stringify } = require('csv-stringify/sync');
const PrivateError = require('../../src/errors/error/private-error');
const scriptErrorMap = require('../../src/errors/script-error');

// npm parameter
const fieldName = process.env.npm_config_field
  ? process.env.npm_config_field.toLocaleLowerCase()
  : null;

// check fieldName is existed and right type
if (isNil(fieldName) || typeof fieldName !== 'string')
  throw new PrivateError(scriptErrorMap['needFieldNameParameter']);

//get folder location which we need
const folder = path.join(__dirname, '../field-info'); //spaceMap存在的地點
const spaceRawDataFolder = path.join(__dirname, '../space-raw-data'); // raw data csv 放置的地點

try {
  const { zoneMap, zoneKey } = require(`${folder}/${fieldName}-spaceMap`);
  const spaces = [zoneKey];

  for (let zoneIndex = 0; zoneIndex < zoneMap.length; zoneIndex++) {
    const zone = zoneMap[zoneIndex];
    for (let col = zone.col[0]; col < zone.col[1] + 1; col++) {
      for (let row = zone.row[0]; row < zone.row[1] + 1; row++) {
        const data = [
          zone.field,
          zone.zone,
          zone.name,
          zone.spaceType,
          zone.version,
          col,
          row,
          col,
          row,
        ];
        spaces.push(data);
      }
    }
  }
  const csv = stringify(spaces);

  fs.writeFile(
    `${spaceRawDataFolder}/${fieldName}-spaces-raw-data.csv`,
    csv,
    function (err) {
      if (err) throw err;
      console.log('complete');
    }
  );
} catch (err) {
  if (err.code === 'MODULE_NOT_FOUND')
    throw new PrivateError(scriptErrorMap['fieldNotFound']);
}
