const zoneMap = [
  {
    field: '樂天桃園棒球場',
    zone: '西下A',
    spaceType: 'seat',
    version: '1.0.0',
    col: [1, 32],
    row: [1, 19],
  },
  {
    field: '樂天桃園棒球場',
    zone: '西下B',
    spaceType: 'seat',
    version: '1.0.0',
    col: [1, 21],
    row: [1, 20],
  },
];

const zoneKey = [
  'field',
  'zone',
  'spaceType',
  'version',
  'colNumber',
  'rowNumber',
];

module.exports = { zoneMap, zoneKey };
