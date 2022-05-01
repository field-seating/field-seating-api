const express = require('express');
const yup = require('yup');

const validate = require('../../middleware/validate');
const userController = require('../../controllers/user-controller');
const { authenticated } = require('../../middleware/auth');
const {
  passwordValidate,
  nameValidate,
  emailValidate,
} = require('../../services/schema/validate');

const router = express.Router();

const signUpSchema = yup.object({
  body: yup.object({
    email: emailValidate,
    name: nameValidate,
    password: passwordValidate,
  }),
});

const updateMeSchema = yup.object({
  body: yup.object({
    name: nameValidate,
  }),
});

router.get('/me', authenticated, userController.getUserMe);
router.post('/', validate(signUpSchema), userController.signUp);
router.put(
  '/me',
  validate(updateMeSchema),
  authenticated,
  userController.updateMe
);
router.post('/verify-email', authenticated, userController.resendVerifyEmail); // 寄發認證信件

module.exports = router;
