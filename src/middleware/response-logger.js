const { bodySanitizer } = require('./helpers');

const responesLogger = (req, res, next) => {
  const originalSend = res.send;
  const requestTime = req.requestTime;

  res.send = function (content) {
    let body = {};
    try {
      body = JSON.parse(content);
    } catch (e) {
      req.logger.info(e);
    }

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
