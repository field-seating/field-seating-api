const passport = require('../config/passport');
const GeneralError = require('../controllers/helpers/general-error');
const authErrorMap = require('../errors/auth-error');

const authenticated = (req, res, next) => {
  console.log(req);
  passport.authenticate('jwt', { session: false }, (err, user) => {
    console.log(user);
    if (err || !user) throw new GeneralError(authErrorMap['noAuth']);
    req.user = user;
    next();
  })(req, res, next);
};
module.exports = { authenticated };
