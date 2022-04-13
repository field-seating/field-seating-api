const morgan = require('morgan');
const logger = require('../config/logger');

const requestLogger = morgan((token, req) => {
  const body = JSON.stringify(req.body);
  logger.info('request in', {
    requestId: req.requestId,
    body,
  });
});

module.exports = requestLogger;
