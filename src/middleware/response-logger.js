const logger = require('../config/logger');
const { bodySanitizer } = require('./helpers');

const responesLogger = (req, res, next) => {
  const originalSend = res.send;
  const httpUrl = req.url;
  const requestId = req.requestId;
  const httpMethod = req.method;

  res.send = function (content) {
    const body = JSON.parse(content);
    logger.info('response out', {
      requestId,
      httpUrl,
      httpMethod,
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
