const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const prisma = require('../config/prisma');
const GeneralError = require('../controllers/helpers/general-error');
const signInErrorMap = require('../errors/sign-in-error');
const authErrorMap = require('../errors/auth-error');
const { comparePassword } = require('../controllers/helpers/password');
const { env } = require('../config/config');

passport.use(
  new LocalStrategy({ usernameField: 'email' }, async function (
    email,
    password,
    done
  ) {
    // find user
    const user = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    // email not exist
    if (!user) return done(new GeneralError(signInErrorMap['wrongInput']));
    // password wrong
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return done(new GeneralError(signInErrorMap['wrongInput']));
    return done(null, user);
  })
);
// jwt
const jwtOptions = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: env.JWT_SECRET,
};
passport.use(
  new JWTStrategy(jwtOptions, async function (jwtPayload, done) {
    // find user
    const user = await prisma.users.findUnique({
      where: {
        id: jwtPayload.id,
      },
    });
    // not find
    if (!user) return done(new GeneralError(authErrorMap['noAuth']));
    return done(null, user);
  })
);

module.exports = passport;