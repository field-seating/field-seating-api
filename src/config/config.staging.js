const config = {
  baseUrl: 'https://fieldseating.wendellatman.com',
  verifyEmail: {
    verifyTokenLife: '1d', //24h
  },
  log: {
    maxFilesDays: 30,
    maxLevel: 'info',
    handleExceptions: true,
  },
};

module.exports = config;
