const morgan = require('morgan');
const logger = require('../config/logger');

const requestLogger = morgan((token, req) => {
  const body = req.body;
  const url = req.url;

  logger.info('request in', {
    requestId: req.requestId,
    body,
    url,
  });
});

module.exports = requestLogger;
