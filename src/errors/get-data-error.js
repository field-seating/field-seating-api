const getDataErrorMap = {
  fieldNotFound: {
    message: '該球場並不存在',
    code: 'D001',
    httpCode: 404,
  },
  zoneNotFound: {
    message: '該區域並不存在',
    code: 'D002',
    httpCode: 404,
  },
  spaceNotFound: {
    message: '該空間並不存在',
    code: 'D003',
    httpCode: 404,
  },
  photoNotFound: {
    message: '該照片並不存在',
    code: 'D004',
    httpCode: 404,
  },
};

module.exports = getDataErrorMap;
