const yup = require('yup');
const signUpErrorMap = require('../../errors/sign-up-error');
const GeneralError = require('../../errors/error/general-error');
const alwaysThrow = require('../../utils/func/always-throw');

const passwordValidate = yup
  .string()
  .required(alwaysThrow(new GeneralError(signUpErrorMap.passwordRequired)))
  .min(8, alwaysThrow(new GeneralError(signUpErrorMap.passwordLength)))
  .max(30, alwaysThrow(new GeneralError(signUpErrorMap.passwordLength)));

const nameValidate = yup
  .string()
  .trim()
  .required(alwaysThrow(new GeneralError(signUpErrorMap.nameRequired)))
  .max(20, alwaysThrow(new GeneralError(signUpErrorMap.maximumExceededName)));

const emailValidate = yup
  .string()
  .required(alwaysThrow(new GeneralError(signUpErrorMap.emailRequired)))
  .email(alwaysThrow(new GeneralError(signUpErrorMap.emailFormat)));

module.exports = {
  passwordValidate,
  nameValidate,
  emailValidate,
};
