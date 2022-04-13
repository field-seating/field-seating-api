const { randomUUID } = require('crypto');

const requestIdMiddleware = (req, resp, next) => {
  req.requestId = randomUUID();
  next();
};

module.exports = requestIdMiddleware;
