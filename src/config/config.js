const configFromEnv = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
};

const config = {
  development: {
    log: {
      maxFilesDays: 3,
      maxLevel: 'debug',
    },
  },
  production: {
    log: {
      maxFilesDays: 30,
      maxLevel: 'info',
    },
  },
};

const isProduction = process.env.NODE_MODULE === 'production';
const configByEnv = isProduction ? config.production : config.development;

module.exports = { ...configByEnv, ...configFromEnv };
