const context = require('../context');

const developmentConfig = require('./config.development');
const stagingConfig = require('./config.staging');
const productionConfig = require('./config.production');

const configFromEnv = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  sibKey: process.env.SIB_KEY,
};

const envMap = {
  development: developmentConfig,
  staging: stagingConfig,
  production: productionConfig,
};

module.exports = { ...envMap[context.getEnv()], ...configFromEnv };
