const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  if (err instanceof Error) {
    const { code, message, httpCode, stack } = err;

    logger.error('got an error', { code, message, stack });
    res.status(httpCode || 400).json({
      status: 'error',
      code: `${code}`,
      message: `${message}`,
    });
  } else {
    const { code, message, stack } = err;
    logger.error('got an error', { code, message, stack });

    res.status(500).json({
      status: 'error',
      message: 'unexpected error',
    });
  }
  next();
};

module.exports = errorHandler;
