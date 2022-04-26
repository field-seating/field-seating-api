const developmentConfig = require('./config.development');
const stagingConfig = require('./config.staging');
const productionConfig = require('./config.production');
const context = require('../context');

const configFromEnv = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  sibKey: process.env.SIB_KEY,
  redisUrl: process.env.REDIS_URL,
};

const envMap = {
  development: developmentConfig,
  staging: stagingConfig,
  production: productionConfig,
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
