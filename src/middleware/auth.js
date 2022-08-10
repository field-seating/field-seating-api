const passport = require('../config/passport');
const GeneralError = require('../errors/error/general-error');
const authErrorMap = require('../errors/auth-error');

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) next(new GeneralError(authErrorMap['unauthorized']));
    req.user = user;

    req.logger = req.logger.child({ userId: user.id });

    next();
  })(req, res, next);
};
const bindUser = async (req, res, next) => {
  console.log(req);
  // eslint-disable-next-line no-unused-vars
  await new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
      if (err || !user) return next();
      // if no auth
      req.user = user;
      console.log(req);
      // req.logger = req.logger.child({ userId: user.id });
      next();
      resolve();
    })(req, res, next);
  });
};

module.exports = { authenticated, bindUser };
