const { format, transports } = require('winston');

const config = require('../config');

const { log: logConfig } = config;

const jsonStructureFormatter = format.printf(
  ({ level, message, httpUrl, httpMethod, requestId, duration, ...rest }) => {
    const output = {
      level,
      httpUrl,
      httpMethod,
      message,
      ...rest,
      requestId,
      duration,
    };

    return `${JSON.stringify(output)}`;
  }
);

let consoleFormatList = [jsonStructureFormatter];

if (process.env.NODE_ENV !== 'production') {
  consoleFormatList = consoleFormatList.concat(format.colorize({ all: true }));
}

const consoleTransport = new transports.Console({
  level: logConfig.maxLevel,
  handleExceptions: logConfig.handleExceptions,
  format: format.combine(...consoleFormatList),
  stderrLevels: ['error'],
});

module.exports = {
  consoleTransport,
};
