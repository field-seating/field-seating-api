const config = {
  baseUrl: 'https://fieldseating.wendellatman.com',
  verifyEmail: {
    verifyTokenLife: '5m', //5min
    rateLimit: {
      windowSize: 60,
      limit: 1,
    },
  },
  log: {
    maxLevel: 'debug',
    handleExceptions: false,
  },
};

module.exports = config;
