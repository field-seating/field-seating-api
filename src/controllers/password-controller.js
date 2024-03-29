const resSuccess = require('./helpers/response');
const PasswordService = require('../services/password-service');
const EmailService = require('../services/email-service');

const passwordController = {
  recoveryPassword: async (req, res, next) => {
    const { email } = req.body;

    const passwordService = new PasswordService({ logger: req.logger });
    const emailService = new EmailService({ logger: req.logger });

    try {
      const { user, passwordResetToken: passwordResetTokenEntity } =
        await passwordService.recoveryPassword(email);

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

    const passwordService = new PasswordService({ logger: req.logger });
    try {
      await passwordService.updatePassword(token, newPassword);
      res.status(200).json(resSuccess());
    } catch (err) {
      next(err);
    }
  },
};

module.exports = passwordController;
