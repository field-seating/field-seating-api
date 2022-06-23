const config = {
  assetDomain: 'field-seating.sgp1.cdn.digitaloceanspaces.com',
  doEndpoint: 'sgp1.digitaloceanspaces.com',
  doBucket: 'field-seating',
  baseUrl: 'https://fieldseating.wendellatman.com',
  verifyEmail: {
    rateLimit: {
      windowSize: 60,
      limit: 5,
    },
  },
  passwordResetEmail: {
    tokenLife: 60 * 60 * 1,
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
  uselessLimit: {
    limit: -1,
  },
};

module.exports = config;
