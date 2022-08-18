const passport = require('../config/passport');
const GeneralError = require('../errors/error/general-error');
const authErrorMap = require('../errors/auth-error');
const { roleMap } = require('../models/user/constants');

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) next(new GeneralError(authErrorMap['unauthorized']));
    req.user = user;

    req.logger = req.logger.child({ userId: user.id });

    next();
  })(req, res, next);
};
const bindUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) return next(); // if no auth
    req.user = user;
    req.logger = req.logger.child({ userId: user.id });

    next();
  })(req, res, next);
};
const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user || user.role !== roleMap.admin)
      next(new GeneralError(authErrorMap['unauthorized']));

    req.user = user;

    req.logger = req.logger.child({ userId: user.id });

    next();
  })(req, res, next);
};

module.exports = { authenticated, bindUser, authenticatedAdmin };
