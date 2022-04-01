const express = require('express');
const yup = require('yup');

const validate = require('../../middleware/validate');
const userController = require('../../controllers/user-controller');
const GeneralError = require('../../controllers/helpers/general-error');
const signUpErrorMap = require('../../errors/signUpError');
const alwaysThrow = require('../../utils/func/always-throw');

const router = express.Router();

const signUpSchema = yup.object({
  body: yup.object({
    email: yup
      .string()
      .email(alwaysThrow(new GeneralError(signUpErrorMap.emailRequired))),
    name: yup
      .string()
      .required(alwaysThrow(new GeneralError(signUpErrorMap.nameRequired))),
    password: yup
      .string()
      .min(8, alwaysThrow(new GeneralError(signUpErrorMap.passwordLength)))
      .max(30, alwaysThrow(new GeneralError(signUpErrorMap.passwordLength))),
  }),
});

router.post('/', validate(signUpSchema), userController.signUp);

module.exports = router;
