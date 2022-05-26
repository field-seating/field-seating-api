const fs = require('fs');
const { stringify } = require('csv-stringify/sync');
const { zoneMap, zoneKey } = require('./zone-constant');

const spaces = [zoneKey];

for (let z = 0; z < zoneMap.length; z++) {
  for (let c = zoneMap[z].col[0]; c < zoneMap[z].col[1] + 1; c++) {
    for (let r = zoneMap[z].row[0]; r < zoneMap[z].row[1] + 1; r++) {
      var data = [
        zoneMap[z].field,
        zoneMap[z].zone,
        zoneMap[z].spaceType,
        zoneMap[z].version,
        c,
        r,
      ];
      spaces.push(data);
    }
  }
}
const csv = stringify(spaces);

fs.writeFile('input.csv', csv, function (err) {
  if (err) throw err;
  console.log('complete');
});
