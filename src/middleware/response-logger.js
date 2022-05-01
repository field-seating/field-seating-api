const { bodySanitizer } = require('./helpers');

const responesLogger = (req, res, next) => {
  const originalSend = res.send;
  const requestTime = req.requestTime;

  res.send = function (content) {
    const body = JSON.parse(content);
    const responseTime = new Date();

    const duration = responseTime - requestTime;

    req.logger.info('response out', {
      duration,
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
