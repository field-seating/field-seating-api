const logger = require('../config/logger');

class BaseService {
  constructor({ req }) {
    this.logger = logger.child({ requestId: req.requestId });
  }
}

module.exports = BaseService;
