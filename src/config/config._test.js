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
      windowSize: 1,
      limit: 1000,
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
    windowSize: 1,
    limit: 50,
  },
  log: {
    maxLevel: 'error',
    handleExceptions: true,
  },
  uselessLimit: {
    limit: -1,
  },
  postPhotoRateLimit: {
    windowSize: 60,
    limit: 2,
  },
  postReportRateLimit: {
    windowSize: 60,
    limit: 2,
  },
};

module.exports = config;
