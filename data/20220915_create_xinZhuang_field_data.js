const path = require('path');
const createData = require('./utils/create-field-data');

const fieldData = require('./field-info/xinZhuang-Zone.json'); // data of field (include field, orientation, level, zone)
const folder = path.join(__dirname, '../data/space-data/xinZhuang');

createData(fieldData, folder);
