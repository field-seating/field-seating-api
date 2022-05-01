const globalLogger = require('../config/logger');

const compatibleLogger = ({ logger, req }) => {
  if (req) {
    return globalLogger.child({ requestId: req.requestId });
  }

  if (logger) {
    return logger;
  }

  return globalLogger;
};

class BaseService {
  constructor({ req, logger }) {
    this.logger = compatibleLogger({ req, logger });
  }
}

module.exports = BaseService;
