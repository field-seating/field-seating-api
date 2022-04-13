const { randomUUID } = require('crypto');

const requestIdMiddleware = (req, res, next) => {
  const requestId = randomUUID();
  req.requestId = requestId;
  res.set('requestId', requestId);
  next();
};

module.exports = requestIdMiddleware;
