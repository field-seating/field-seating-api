const { format, transports } = require('winston');
const { mergeRight } = require('ramda');

const config = require('../config');

const { log: logConfig } = config;
const timestampFormatter = format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' });

const jsonStructureFormatter = format.printf(
  ({ timestamp, level, message, url, requestId, ...rest }) => {
    const requestIdOutput = requestId ? { requestId } : {};

    const output = mergeRight(
      {
        level,
        url,
        message,
        ...rest,
        timestamp,
      },
      requestIdOutput
    );

    return `${JSON.stringify(output)}`;
  }
);

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
  filename: `error-%DATE%.log`,
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

module.exports = {
  fileTransport,
  fileErrorTransport,
  consoleTransport,
  timestampFormatter,
  jsonStructureFormatter,
};
