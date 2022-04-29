const isProductionBuild = () => process.env.NODE_ENV === 'production';
const isDevelopmentBuild = () => process.env.NODE_ENV !== 'production';

const appEnvSet = new Set(['production', 'staging', 'development', 'test']);

const getEnv = () => {
  const appEnv = process.env.APP_ENV;
  if (!appEnvSet.has(appEnv)) {
    return 'staging';
  }

  return appEnv;
};

module.exports = {
  getEnv,
  isProductionBuild,
  isDevelopmentBuild,
};
