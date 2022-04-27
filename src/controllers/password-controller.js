const { isNil } = require('ramda');

const resSuccess = require('./helpers/response');
const PasswordService = require('../services/password-service');
const EmailService = require('../services/email-service');
const UserService = require('../services/user-service');
const GeneralError = require('../errors/error/general-error');
const passwordErrorMap = require('../errors/password-error');

const passwordController = {
  // TODO: limit mail sending rate
  recoveryPassword: async (req, res, next) => {
    const { email } = req.body;

    const userService = new UserService({ req });
    const passwordService = new PasswordService({ req });
    const emailService = new EmailService({ req });

    try {
      const user = await userService.getUserByEmail(email);

      if (isNil(user)) {
        throw new GeneralError(passwordErrorMap.emailInvalid);
      }

      const passwordResetTokenEntity =
        await passwordService.createPasswordResetToken(user.id);

      await emailService.sendPasswordResetMail(
        user,
        passwordResetTokenEntity,
        req.requestTime
      );

      res.status(200).json(resSuccess());
    } catch (err) {
      next(err);
    }
  },

  updatePassword: async (req, res, next) => {
    const { token, newPassword } = req.body;

    console.log({ token, newPassword });
    try {
      res.status(200).json(resSuccess());
    } catch (err) {
      next(err);
    }
  },
};

module.exports = passwordController;
