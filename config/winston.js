const { createLogger, format, transports } = require('winston');
const appRoot = require('app-root-path');
const level = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

// define the custom settings for each transport (file, console)
const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = createLogger({
  level: level[6],
  format: format.json(),
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console),
  ],
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize({ all: true }), format.simple()),
    })
  );
}

logger.stream = {
  write: function (message) {
    logger.info(message);
  },
};

module.exports = logger;
