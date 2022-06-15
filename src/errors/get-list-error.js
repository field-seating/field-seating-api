const getListErrorMap = {
  orientationsNotFound: {
    message: '該球場無任何方位資訊',
    code: 'L001',
    httpCode: 404,
  },
  levelsNotFound: {
    message: '該球場無任何樓層資訊',
    code: 'L002',
    httpCode: 404,
  },
  zonesNotFound: {
    message: '該球場無任何區域資訊',
    code: 'L003',
    httpCode: 404,
  },
  spacesNotFound: {
    message: '該區域無任何空間資訊',
    code: 'L004',
    httpCode: 404,
  },
};

module.exports = getListErrorMap;
