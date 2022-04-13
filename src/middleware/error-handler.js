const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    const { code, message, httpCode } = err;

    logger.error('got an error', { err });
    res.status(httpCode || 400).json({
      status: 'error',
      code: `${code}`,
      message: `${message}`,
    });
  } else {
    logger.error('got a uncaught error', { err });

    res.status(500).json({
      status: 'error',
      message: 'unexpected error',
    });
  }
  next();
};

module.exports = errorHandler;
