const authErrorMap = {
  unauthorized: {
    message: '無法認證',
    code: 'A001',
    httpCode: 401,
  },
  unauthorizedAdmin: {
    message: '無此權限',
    code: 'A002',
    httpCode: 401,
  },
};

module.exports = authErrorMap;
