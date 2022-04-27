const { createClient } = require('redis');

const config = require('./config');
const logger = require('./logger');

let client;

const init = async () => {
  const redisClient = createClient({
    url: config.redisUrl,
  });

  redisClient.on('error', (err) => logger.error('Redis Client Error', err));

  await redisClient.connect();

  client = redisClient;
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
