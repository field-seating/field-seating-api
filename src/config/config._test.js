const config = {
  baseUrl: 'https://fieldseating.wendellatman.com',
  verifyEmail: {
    verifyTokenLife: '1d', //24h
    rateLimit: {
      windowSize: 60,
      limit: 1,
    },
  },
  log: {
    maxLevel: 'info',
    handleExceptions: true,
  },
};

module.exports = config;
