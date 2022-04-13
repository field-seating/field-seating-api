const logger = require('../config/logger');
const { bodySanitizer } = require('./helpers');

const responesLogger = (req, res, next) => {
  const originalSend = res.send;
  const url = req.url;
  const requestId = req.requestId;

  res.send = function (body) {
    logger.info('response out', {
      url,
      requestId,
      body: bodySanitizer(JSON.parse(body)),
    });
    originalSend.call(this, body);
  };

  next();
};

module.exports = responesLogger;
