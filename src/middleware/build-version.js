const { buildVersion } = require('../config/config');
const context = require('../context');

const buildVersionMiddleware = (req, res, next) => {
  const appEnv = context.getEnv();

  const buildNumber = `${appEnv}:${buildVersion}`;

  res.set('fs-api-build', buildNumber);
  next();
};

module.exports = buildVersionMiddleware;
