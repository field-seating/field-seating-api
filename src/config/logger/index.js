const { createLogger } = require('winston');
require('winston-daily-rotate-file');

const { consoleTransport } = require('./helper');

let transportList = [consoleTransport];

const logger = createLogger({
  transports: transportList,
  exceptionHandlers: [consoleTransport],
});

module.exports = logger;
