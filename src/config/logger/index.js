const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const appRoot = require('app-root-path');

const config = require('../config');
const { timestampFormatter, jsonStructureFormatter } = require('./helper');

const { log: logConfig } = config;
const isProduction = process.env.NODE_ENV === 'production';

const fileTransport = new transports.DailyRotateFile({
  level: logConfig.maxLevel,
  dirname: 'logs',
  filename: `application-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: `${logConfig.maxFilesDays}d`,
  format: format.combine(timestampFormatter, jsonStructureFormatter),
});

const fileErrorTransport = new transports.DailyRotateFile({
  level: 'error',
  dirname: 'logs',
  filename: `${appRoot}/logs/error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: `${logConfig.maxFilesDays}d`,
  format: format.combine(timestampFormatter, jsonStructureFormatter),
});

const consoleTransport = new transports.Console({
  level: logConfig.maxLevel,
  handleExceptions: true,
  format: format.combine(
    timestampFormatter,
    jsonStructureFormatter,
    format.colorize({ all: true })
  ),
});

let transportList = [fileErrorTransport, fileTransport];

if (!isProduction) {
  transportList = transportList.concat([consoleTransport]);
}

const logger = createLogger({
  transports: transportList,
  exceptionHandlers: [fileErrorTransport],
});

module.exports = logger;
