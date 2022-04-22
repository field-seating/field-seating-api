const express = require('express');
const yup = require('yup');

const validate = require('../../middleware/validate');
const userController = require('../../controllers/user-controller');
const GeneralError = require('../../errors/error/general-error');
const signUpErrorMap = require('../../errors/sign-up-error');
const alwaysThrow = require('../../utils/func/always-throw');
const { authenticated } = require('../../middleware/auth');

const router = express.Router();

const signUpSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .required(alwaysThrow(new GeneralError(signUpErrorMap.emailRequired)))
      .email(alwaysThrow(new GeneralError(signUpErrorMap.emailFormat))),
    name: yup
      .string()
      .required(alwaysThrow(new GeneralError(signUpErrorMap.nameRequired))),
    password: yup
      .string()
      .required(alwaysThrow(new GeneralError(signUpErrorMap.passwordRequired)))
      .min(8, alwaysThrow(new GeneralError(signUpErrorMap.passwordLength)))
      .max(30, alwaysThrow(new GeneralError(signUpErrorMap.passwordLength))),
  }),
});

router.get('/info', authenticated, userController.getUserInfo);
router.post('/', validate(signUpSchema), userController.signUp);
router.post('/verify-email', authenticated, userController.sendVerifyEmail); // 寄發認證信件

module.exports = router;
