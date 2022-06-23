const config = {
  assetDomain: 'https://field-seating.sgp1.cdn.digitaloceanspaces.com',
  doEndpoint: 'sgp1.digitaloceanspaces.com',
  doBucket: 'field-seating',
  baseUrl: 'https://fieldseating.wendellatman.com',
  verifyEmail: {
    rateLimit: {
      windowSize: 60 * 60 * 3,
      limit: 2,
    },
  },
  passwordResetEmail: {
    tokenLife: 60 * 60 * 24,
    rateLimit: {
      windowSize: 60 * 60 * 3,
      limit: 2,
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
