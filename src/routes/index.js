const express = require('express');
const yup = require('yup');

const validate = require('../middleware/validate');
const passport = require('../config/passport');
const userController = require('../controllers/user-controller');
const user = require('./modules/user');
const record = require('./modules/record');
const { authenticated } = require('../middleware/auth');
const password = require('./modules/password');
const { isDevelopmentBuild } = require('../context');
const {
  passwordValidate,
  emailValidate,
} = require('../services/schema/validate');

const router = express.Router();

// use by signIn
const signInSchema = yup.object({
  body: yup.object({
    email: emailValidate,
    password: passwordValidate,
  }),
});

router.post(
  '/api/signin',
  validate(signInSchema),
  passport.authenticate('local', { session: false }),
  userController.signIn
);
router.use('/api/users', user);
router.use('/api/records', authenticated, record);
router.use('/api/password', password);
router.patch('/api/verify-email', userController.verifyEmail);

// 檢視email格式使用
if (isDevelopmentBuild()) {
  router.get('/test-email/:emailTemplate', (req, res) => {
    res.render(req.params.emailTemplate);
  });
}

module.exports = router;
