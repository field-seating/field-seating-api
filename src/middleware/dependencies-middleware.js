const globalLogger = require('../config/logger');

const getLogger = (req) => {
  const httpUrl = req.url;
  const httpMethod = req.method;
  const requestId = req.requestId;
  const ip = req.ip;

  return globalLogger.child({ requestId, httpMethod, httpUrl, ip });
};

const dependenciesMiddleware = (req, res, next) => {
  const logger = getLogger(req);
  req.logger = logger;
  next();
};

module.exports = dependenciesMiddleware;
