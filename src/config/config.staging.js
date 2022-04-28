const config = {
  foo: 'bar_staging',
  baseUrl: 'https://fieldseating.wendellatman.com',
  verifyEmail: {
    verifyTokenLife: '1d', //24h
    rateLimit: {
      windowSize: 60,
      limit: 1,
    },
  },
  reqRateLimit: {
    windowSize: 60,
    limit: 300,
  },
  log: {
    maxLevel: 'info',
    handleExceptions: true,
  },
};

module.exports = config;
