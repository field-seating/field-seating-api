const logger = require('../config/logger');
const { bodySanitizer } = require('./helpers');

const requestLogger = (req, res, next) => {
  const body = req.body;
  const url = req.url;
  const requestId = req.requestId;

  logger.info('request in', {
    requestId,
    body: bodySanitizer(body),
    url,
  });
  next();
};

module.exports = requestLogger;
