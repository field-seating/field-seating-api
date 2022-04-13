const express = require('express');
const yup = require('yup');

const validate = require('../middleware/validate');
const passport = require('../config/passport');
const userController = require('../controllers/user-controller');
const user = require('./modules/user');
const GeneralError = require('../controllers/helpers/general-error');
const signUpErrorMap = require('../errors/sign-up-error');
const alwaysThrow = require('../utils/func/always-throw');
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

router.get('/api/log-test', async (req, res, next) => {
  const wait = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

  await wait();
  next(new Error(123));
  //res.json({});
});

router.post(
  '/api/signin',
  validate(signInSchema),
  passport.authenticate('local', { session: false }),
  userController.signIn
);
router.use('/api/users', user);

module.exports = router;
