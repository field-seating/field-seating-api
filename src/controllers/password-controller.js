const resSuccess = require('./helpers/response');
const PasswordService = require('../services/password-service');
const EmailService = require('../services/email-service');
const UserService = require('../services/user-service');

const passwordController = {
  recoveryPassword: async (req, res, next) => {
    const { email } = req.body;

    const userService = new UserService({ req });
    const passwordService = new PasswordService({ req });
    const emailService = new EmailService({ req });

    try {
      const user = await userService.getUserByEmail(email);
      const token = await passwordService.createPasswordResetToken(user.id);
      await emailService.sendPasswordResetMail(user, token);

      res.status(200).json(resSuccess());
    } catch (err) {
      next(err);
    }
  },
  updatePassword: async (req, res, next) => {
    try {
      res.status(200).json(resSuccess());
    } catch (err) {
      next(err);
    }
  },
};

module.exports = passwordController;
