const { createLogger } = require('winston');
require('winston-daily-rotate-file');

const {
  fileErrorTransport,
  fileTransport,
  consoleTransport,
} = require('./helper');

const isProduction = process.env.NODE_ENV === 'production';

let transportList = [fileErrorTransport, fileTransport];

if (!isProduction) {
  transportList = transportList.concat([consoleTransport]);
}

const logger = createLogger({
  transports: transportList,
  exceptionHandlers: [fileErrorTransport],
});

module.exports = logger;
