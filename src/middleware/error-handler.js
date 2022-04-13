const logger = require('../config/logger');

const errorHandler = (err, req, res) => {
  console.log('got a err', err);
  if (err instanceof Error) {
    const { code, message, httpCode } = err;

    res.status(httpCode || 400).json({
      status: 'error',
      code: `${code}`,
      message: `${message}`,
    });
  } else {
    logger.error('uncaught error', err);
    console.log('500', err);

    res.status(500).json({
      status: 'error',
      message: 'unexpected error',
    });
  }
};

module.exports = errorHandler;
