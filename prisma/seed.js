const path = require('path');
const createData = require('../data/utils/create-field-data');

const fieldData = require('../seeders/data.json'); // data of field (include field, orientation, level, zone)
const folder = path.join(__dirname, '../seeders/space-data');

createData(fieldData, folder);
