const isProduction = () => process.env.NODE_ENV === 'production';
const isDevelopment = () => process.env.NODE_ENV !== 'production';

const getEnv = () => {
  if (isProduction()) {
    return 'production';
  }
  return 'development';
};

module.exports = {
  getEnv,
  isProduction,
  isDevelopment,
};
