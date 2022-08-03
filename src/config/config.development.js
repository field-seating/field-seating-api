const config = {
  mailSender: {
    general: {
      email: 'op-staging@fieldseating.com',
      name: '球場坐座團隊',
    },
  },
  assetDomain: 'https://field-seating.sgp1.cdn.digitaloceanspaces.com',
  doEndpoint: 'sgp1.digitaloceanspaces.com',
  doBucket: 'field-seating',
  baseUrl: 'https://staging.fieldseating.com',
  verifyEmail: {
    rateLimit: {
      windowSize: 60,
      limit: 2,
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
  postPhotoRateLimit: {
    windowSize: 60,
    limit: 2,
  },
};

module.exports = config;
