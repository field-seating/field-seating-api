const isProduction = () => process.env.NODE_ENV === 'production';
const isDevelopment = () => process.env.NODE_ENV !== 'production';

const appEnvSet = new Set(['production', 'staging', 'development']);

const getEnv = () => {
  const appEnv = process.env.APP_ENV;
  if (!appEnvSet.has(appEnv)) {
    return 'staging';
  }

  return appEnv;
};

module.exports = {
  getEnv,
  isProduction,
  isDevelopment,
};
