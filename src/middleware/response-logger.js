const logger = require('../config/winston');

module.exports = {
  resLogger(err, req, res, next) {
    // add this line to include winston logging
    logger.error(
      `${err.code || 500} - ${err.message} - ${req.originalUrl} - ${
        req.method
      } - ${req.ip}`
    );
    next();
  },
};
