const { createLogger, format, transports } = require('winston');
const appRoot = require('app-root-path');

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
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};
// change level while prd or not
if (process.env.NODE_ENV === 'production') {
  options.file.level = 'debug';
  options.console.level = 'debug';
} else {
  options.file.level = 'info';
  options.console.level = 'info';
}

const logger = createLogger({
  transports: [
    // new transports.File(options.file),
    // new transports.Console(options.console),
  ],
});
// for dev
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize({ all: true }), format.simple()),
    })
  );
}

logger.stream = {
  write: function (message, encoding) {
    logger.info(message, encoding);
  },
};

module.exports = logger;
