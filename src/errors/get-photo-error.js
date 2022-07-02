const getPhotoErrorMap = {
  photoNotFound: {
    message: '此照片不存在',
    code: 'gp001',
    httpCode: 404,
  },
  spaceNotFound: {
    message: '此空間並不存在',
    code: 'gp002',
    httpCode: 404,
  },
  photosNotFound: {
    message: '沒有任何照片',
    code: 'gp003',
    httpCode: 404,
  },
};

module.exports = getPhotoErrorMap;
