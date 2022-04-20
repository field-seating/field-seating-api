const requestTimeMiddleware = (req, res, next) => {
  const current = new Date();
  req.requestTime = current;
  next();
};

module.exports = requestTimeMiddleware;
