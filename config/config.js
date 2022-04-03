const env = process.env;

const config = {
  development: {
    username: 'root',
    password: 'password',
    dialect: 'mysql',
  },
  test: {
    username: 'root',
    password: 'password',
    dialect: 'mysql',
  },
  production: {
    username: 'root',
    password: 'password',
    dialect: 'mysql',
  },
};

module.exports = {
  env,
  config,
};
