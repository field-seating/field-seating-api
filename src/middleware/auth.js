const passport = require('../config/passport');
const GeneralError = require('../errors/error/general-error');
const authErrorMap = require('../errors/auth-error');

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    if (err || !user) next(new GeneralError(authErrorMap['unauthorized']));
    req.user = user;
    next();
  })(req, res, next);
};
module.exports = { authenticated };
