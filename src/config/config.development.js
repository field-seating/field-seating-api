const config = {
  baseUrl: 'https://fieldseating.wendellatman.com',
  verifyEmail: {
    verifyTokenLife: '5m', //5min
    rateLimit: {
      windowSize: 60,
      limit: 5,
    },
  },
  passwordResetEmail: {
    tokenLife: 60 * 5, //5min
    rateLimit: {
      windowSize: 60,
      limit: 5,
    },
  },
  reqRateLimit: {
    windowSize: 1,
    limit: 50,
  },
  log: {
    maxLevel: 'debug',
    handleExceptions: false,
  },
};

module.exports = config;
