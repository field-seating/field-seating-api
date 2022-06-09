const getListErrorMap = {
  orientationNotFound: {
    message: '該球場無任何方位資訊',
    code: 'L001',
  },
  levelNotFound: {
    message: '該球場無任何樓層資訊',
    code: 'L002',
  },
  zoneNotFound: {
    message: '該球場無任何區域資訊',
    code: 'L003',
  },
  spaceNotFound: {
    message: '該區域無任何space資訊',
    code: 'L004',
  },
};

module.exports = getListErrorMap;
