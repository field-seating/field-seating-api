const morgan = require('morgan');
const logger = require('../config/logger');
const { bodySanitizer } = require('./helpers');

const requestLogger = morgan((token, req) => {
  const body = req.body;
  const url = req.url;
  const requestId = req.requestId;

  logger.info('request in', {
    requestId,
    body: bodySanitizer(body),
    url,
  });
});

module.exports = requestLogger;
