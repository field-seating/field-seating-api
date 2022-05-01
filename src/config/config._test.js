const config = {
  baseUrl: 'https://fieldseating.wendellatman.com',
  verifyEmail: {
    verifyTokenLife: '1d', //24h
    rateLimit: {
      windowSize: 1,
      limit: 1000,
    },
  },
  passwordResetEmail: {
    tokenLife: '1d', //5min
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
    maxLevel: 'error',
    handleExceptions: true,
  },
};

module.exports = config;
