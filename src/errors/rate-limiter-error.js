const rateLimiterErrorMap = {
  exceedLimit: {
    message: '超過限額',
    code: 'rl001',
  },
  windowSizeInvalid: {
    message: 'windowSize should be a positive integer',
    code: 'rl002',
  },
  limitInvalid: {
    message: 'limit should be a positive integer',
    code: 'rl003',
  },
  keyInvalid: {
    message: 'key is required',
    code: 'rl004',
  },
};

module.exports = rateLimiterErrorMap;
