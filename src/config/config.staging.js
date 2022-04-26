const config = {
  foo: 'bar_staging',
  baseUrl: 'https://fieldseating.wendellatman.com',
  verifyEmail: {
    verifyTokenLife: '1d', //24h
  },
  log: {
    maxLevel: 'info',
    handleExceptions: true,
  },
};

module.exports = config;
