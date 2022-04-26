const config = {
  baseUrl: 'https://fieldseating.wendellatman.com',
  verifyEmail: {
    verifyTokenLife: '5m', //5min
  },
  log: {
    maxFilesDays: 3,
    maxLevel: 'debug',
    handleExceptions: false,
  },
};

module.exports = config;
