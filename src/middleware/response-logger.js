const logger = require('../config/logger');
const { bodySanitizer } = require('./helpers');

const responesLogger = (req, res, next) => {
  const originalSend = res.send;
  const url = req.url;
  const requestId = req.requestId;

  res.send = function (content) {
    const body = JSON.parse(content);
    logger.info('response out', {
      url,
      requestId,
      body: {
        ...body,
        data: bodySanitizer(body.data),
      },
    });
    originalSend.call(this, content);
  };

  next();
};

module.exports = responesLogger;
