const config = {
  mailSender: {
    general: {
      email: 'op@fieldseating.com',
      name: '球場坐座團隊',
    },
  },
  assetDomain: 'https://field-seating.sgp1.cdn.digitaloceanspaces.com',
  doEndpoint: 'sgp1.digitaloceanspaces.com',
  doBucket: 'field-seating',
  baseUrl: 'https://fieldseating.com',
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
  uselessLimit: {
    limit: -100,
  },
  postPhotoRateLimit: {
    windowSize: 60 * 60 * 24,
    limit: 50,
  },
  postReportRateLimit: {
    windowSize: 60 * 60 * 24,
    limit: 5,
  },
};

module.exports = config;
