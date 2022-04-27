const { bodySanitizer } = require('./helpers');

const requestLogger = (req, res, next) => {
  const body = req.body;

  req.logger.info('request in', {
    body: bodySanitizer(body),
  });
  next();
};

module.exports = requestLogger;
