const configFromEnv = {
  port: process.env.PORT,
  jwtSecret: process.env.JWT_SECRET,
  databaseUrl: process.env.DATABASE_URL,
  sibKey: process.env.SIB_KEY,
};

const config = {
  development: {
    baseUrl: 'http://localhost:3000',
    emailSender: 'ronnychiang1164@gmail.com',
    emailReceiver: 'ronnychiang1164@gmail.com',
    log: {
      maxFilesDays: 3,
      maxLevel: 'debug',
      handleExceptions: false,
    },
  },
  production: {
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
