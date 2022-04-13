const logger = require('../config/logger');
const { bodySanitizer } = require('./helpers');

const responesLogger = (req, res, next) => {
  const originalSend = res.send;

  res.send = function (body) {
    logger.info('response out', { body: bodySanitizer });
    originalSend.call(this, body);
  };

  next();
};

module.exports = responesLogger;
