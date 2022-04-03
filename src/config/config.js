const configFromEnv = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
};
const config = {
  development: {},
  production: {},
};
const isProduction = process.env.NODE_MODULE === 'production';
const configByEnv = isProduction ? config.production : config.development;
module.exports = { ...configByEnv, ...configFromEnv };
