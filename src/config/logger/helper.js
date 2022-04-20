const { format, transports } = require('winston');
const { mergeRight } = require('ramda');

const config = require('../config');

const { log: logConfig } = config;

const jsonStructureFormatter = format.printf(
  ({ level, message, url, requestId, ...rest }) => {
    const requestIdOutput = requestId ? { requestId } : {};
    const timestamp = new Date().toISOString();

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
  format: format.combine(jsonStructureFormatter),
});

const fileErrorTransport = new transports.DailyRotateFile({
  level: 'error',
  dirname: 'logs',
  filename: `error-%DATE%.log`,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: `${logConfig.maxFilesDays}d`,
  format: format.combine(jsonStructureFormatter),
});

let consoleFormatList = [jsonStructureFormatter];

if (process.env.NODE_ENV !== 'production') {
  consoleFormatList = consoleFormatList.concat(format.colorize({ all: true }));
}

const consoleTransport = new transports.Console({
  level: logConfig.maxLevel,
  handleExceptions: logConfig.handleExceptions,
  format: format.combine(...consoleFormatList),
});

module.exports = {
  fileTransport,
  fileErrorTransport,
  consoleTransport,
};
