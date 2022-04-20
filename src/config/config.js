const configFromEnv = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  sibKey: process.env.SIB_KEY,
  doKey: process.env.SPACES_SECRET,
};

const config = {
  development: {
    baseUrl: 'https://fieldseating.wendellatman.com',
    verifyEmail: {
      verifyTokenLife: '5m', //5min
    },
    log: {
      maxFilesDays: 3,
      maxLevel: 'debug',
      handleExceptions: false,
    },
  },
  production: {
    baseUrl: 'https://fieldseating.wendellatman.com',
    verifyEmail: {
      verifyTokenLife: '1d', //24h
    },
    log: {
      maxFilesDays: 30,
      maxLevel: 'info',
      handleExceptions: true,
    },
  },
};

const isProduction = process.env.NODE_MODULE === 'production';
const configByEnv = isProduction ? config.production : config.development;

module.exports = { ...configByEnv, ...configFromEnv };
