const rateLimiterHelper = require('../utils/rate-limiter');
const { reqRateLimit } = require('../config/config');
const rateLimiterErrorMap = require('../errors/rate-limiter-error');
const GeneralError = require('../errors/error/general-error');
const globalErrorMap = require('../errors/global-error');

const reqRateLimitMiddleware = async (req, res, next) => {
  const withRateLimit = rateLimiterHelper({
    windowSize: reqRateLimit.windowSize,
    limit: reqRateLimit.limit,
    key: `req:${req.ip}`,
  });

  const wrappedNext = withRateLimit(next);

  try {
    await wrappedNext();
  } catch (err) {
    if (err.code === rateLimiterErrorMap.exceedLimit.code) {
      next(new GeneralError(globalErrorMap.reqExceedLimit));
      return;
    }

    next(err);
  }
};

module.exports = reqRateLimitMiddleware;
