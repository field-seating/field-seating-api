const developmentConfig = require('./config.development');
const stagingConfig = require('./config.staging');
const testConfig = require('./config._test');
const productionConfig = require('./config.production');
const context = require('../context');

const configFromEnv = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  sibKey: process.env.SIB_KEY,
  doKey: process.env.AWS_ACCESS_KEY,
  doSecret: process.env.AWS_SECRET_ACCESS_KEY,
  doEndpoint: process.env.DIGITALOCEAN_ENDPOINT,
  doBucket: process.env.DIGITALOCEAN_BUCKET,
  redisUrl: process.env.REDIS_URL,
};

const envMap = {
  development: developmentConfig,
  staging: stagingConfig,
  production: productionConfig,
  test: testConfig,
};

const getConfigByEnv = () => {
  const appEnv = context.getEnv();

  const envConfig = envMap[appEnv];

  if (!envConfig) {
    return developmentConfig;
  }

  return envConfig;
};

module.exports = { ...getConfigByEnv(), ...configFromEnv };
