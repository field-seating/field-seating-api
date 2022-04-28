const { createClient, defineScript } = require('redis');

const { getEnv } = require('../context');
const config = require('./config');
const logger = require('./logger');

const prependPrefix = (key) => `fs:${getEnv()}:${key}`;

let client;

const init = async () => {
  const redisClient = createClient({
    url: config.redisUrl,
    scripts: {
      incr: defineScript({
        NUMBER_OF_KEYS: 1,
        SCRIPT:
          'local current = redis.call("INCR",KEYS[1]);' + 'return current;',
        transformArguments(key) {
          return [key];
        },
        transformReply(reply) {
          return reply;
        },
      }),
      decr: defineScript({
        NUMBER_OF_KEYS: 1,
        SCRIPT:
          'local current = redis.call("DECR",KEYS[1]);' + 'return current;',
        transformArguments(key) {
          return [key];
        },
        transformReply(reply) {
          return reply;
        },
      }),
    },
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
  prependPrefix,
  getClient,
};
