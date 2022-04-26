const express = require('express');
const yup = require('yup');

const validate = require('../middleware/validate');
const passport = require('../config/passport');
const userController = require('../controllers/user-controller');
const user = require('./modules/user');
const GeneralError = require('../errors/error/general-error');
const signUpErrorMap = require('../errors/sign-up-error');
const alwaysThrow = require('../utils/func/always-throw');
const { isDevelopment } = require('../context');

const router = express.Router();

// use by signIn
const signInSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .required(alwaysThrow(new GeneralError(signUpErrorMap.emailRequired)))
      .email(alwaysThrow(new GeneralError(signUpErrorMap.emailFormat))),
    password: yup
      .string()
      .required(alwaysThrow(new GeneralError(signUpErrorMap.passwordRequired))),
  }),
});

router.post(
  '/api/signin',
  validate(signInSchema),
  passport.authenticate('local', { session: false }),
  userController.signIn
);
router.use('/api/users', user);
router.patch('/api/verify-email', userController.verifyEmail);

// 檢視email格式使用
if (isDevelopment()) {
  router.use('/testemail', (req, res) => res.render('verify-email'));
}

module.exports = router;
