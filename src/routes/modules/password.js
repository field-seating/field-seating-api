const express = require('express');
const yup = require('yup');

const validate = require('../../middleware/validate');
const passwordController = require('../../controllers/password-controller');
const GeneralError = require('../../errors/error/general-error');
const passwordErrorMap = require('../../errors/password-error');
const alwaysThrow = require('../../utils/func/always-throw');

const router = express.Router();

const recoveryPasswordSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .required(alwaysThrow(new GeneralError(passwordErrorMap.emailInvalid)))
      .email(alwaysThrow(new GeneralError(passwordErrorMap.emailInvalid))),
  }),
});

const updatePasswordSchema = yup.object({
  body: yup.object({
    token: yup
      .string()
      .required(alwaysThrow(new GeneralError(passwordErrorMap.tokenInvalid)))
      .min(1, alwaysThrow(new GeneralError(passwordErrorMap.tokenInvalid))),
    newPassword: yup
      .string()
      .required(
        alwaysThrow(new GeneralError(passwordErrorMap.newPasswordRequired))
      )
      .min(8, alwaysThrow(new GeneralError(passwordErrorMap.newPasswordLength)))
      .max(
        30,
        alwaysThrow(new GeneralError(passwordErrorMap.newPasswordLength))
      ),
  }),
});

router.post(
  '/recovery',
  validate(recoveryPasswordSchema),
  passwordController.recoveryPassword
);
router.put(
  '/',
  validate(updatePasswordSchema),
  passwordController.updatePassword
);

module.exports = router;
