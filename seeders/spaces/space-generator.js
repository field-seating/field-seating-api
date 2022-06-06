const fs = require('fs');
const { stringify } = require('csv-stringify/sync');
const { zoneMap, zoneKey } = require('./zone-constant');

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

fs.writeFile('input.csv', csv, function (err) {
  if (err) throw err;
  console.log('complete');
});
