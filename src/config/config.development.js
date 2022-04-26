const config = {
  foo: 'bar',
  baseUrl: 'https://fieldseating.wendellatman.com',
  verifyEmail: {
    verifyTokenLife: '5m', //5min
  },
  log: {
    maxLevel: 'debug',
    handleExceptions: false,
  },
};

module.exports = config;
