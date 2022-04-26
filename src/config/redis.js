const { createClient } = require('redis');

const config = require('./config');
const logger = require('./logger');

let client;

const init = async () => {
  const client = createClient({
    url: config.redisUrl,
  });

  client.on('error', (err) => logger.error('Redis Client Error', err));

  await client.connect();
};

const getClient = async () => {
  if (!client) {
    await init();
  }

  return client;
};

module.exports = {
  getClient,
};
