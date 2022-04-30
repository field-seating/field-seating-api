const logger = require('../config/logger');
const { bodySanitizer } = require('./helpers');

const responesLogger = (req, res, next) => {
  const originalSend = res.send;
  const httpUrl = req.url;
  const requestId = req.requestId;
  const httpMethod = req.method;
  const requestTime = req.requestTime;

  res.send = function (content) {
    const body = JSON.parse(content);
    const responseTime = new Date();

    const duration = responseTime - requestTime;

    logger.info('response out', {
      duration,
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
