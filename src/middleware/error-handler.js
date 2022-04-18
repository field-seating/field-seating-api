const logger = require('../config/logger');
const GeneralError = require('../errors/error/general-error');
const PrivateError = require('../errors/error/private-error');

const errorHandler = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    const { code, message, httpCode, stack } = err;

    logger.error('got an error', { code, message, stack });
    res.status(httpCode || 400).json({
      status: 'error',
      code: `${code}`,
      message: `${message}`,
    });
  } else if (err instanceof PrivateError) {
    const { code, message, httpCode, stack } = err;
    logger.error('got an error', { code, message, stack });

    res.status(httpCode || 400).json({
      status: 'error',
      message: 'unexpected error',
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
