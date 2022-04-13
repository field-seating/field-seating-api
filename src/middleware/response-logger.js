const logger = require('../config/logger');

//const responesLogger = (err, req, res, next) => {
//// add this line to include winston logging
//logger.error(
//`${err.code || 500} - ${err.message} - ${req.originalUrl} - ${
//req.method
//} - ${req.ip}`
//);
//next();
//};
//
const responesLogger = (err, req, res, next) => {
  // add this line to include winston logging
  logger.info(
    `${err.code || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
  next();
};

module.exports = responesLogger;
