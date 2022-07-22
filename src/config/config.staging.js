const config = {
  mailSender: {
    general: {
      email: 'op@staging.fieldseating.com',
      name: '球場坐座團隊',
    },
  },
  assetDomain: 'https://field-seating.sgp1.cdn.digitaloceanspaces.com',
  doEndpoint: 'sgp1.digitaloceanspaces.com',
  doBucket: 'field-seating',
  foo: 'bar_staging',
  baseUrl: 'https://staging.fieldseating.com',
  verifyEmail: {
    rateLimit: {
      windowSize: 60,
      limit: 2,
    },
  },
  passwordResetEmail: {
    tokenLife: 60 * 60 * 24,
    rateLimit: {
      windowSize: 60,
      limit: 5,
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
  uselessLimit: {
    limit: -100,
  },
  postPhotoRateLimit: {
    windowSize: 60 * 60 * 24,
    limit: 50,
  },
};

module.exports = config;
