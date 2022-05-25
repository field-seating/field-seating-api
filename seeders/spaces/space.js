const fs = require('fs');
const { zoneMap } = require('./zone-constant');

const data = {};
data.spaces = [];

for (let z = 0; z < zoneMap.length; z++) {
  for (let c = zoneMap[z].col[0]; c < zoneMap[z].col[1] + 1; c++) {
    for (let r = zoneMap[z].row[0]; r < zoneMap[z].row[1] + 1; r++) {
      var obj = {
        zone: zoneMap[z].zone,
        spaceType: zoneMap[z].spaceType,
        version: zoneMap[z].version,
        colNumber: c,
        rowNumber: r,
      };
      data.spaces.push(obj);
    }
  }
}

fs.writeFile('input.json', JSON.stringify(data), function (err) {
  if (err) throw err;
  console.log('complete');
});
