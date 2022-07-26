const R = require('ramda');
const EmailService = require('../services/email-service');
const UserService = require('../services/user-service');
const resSuccess = require('./helpers/response');
const GeneralError = require('../errors/error/general-error');
const resendVerifyEmailErrorMap = require('../errors/resend-verify-email-error');
const { statusMap } = require('../models/user/constants');

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      // sign up
      const userService = new UserService({ logger: req.logger });
      const user = await userService.signUp(name, email, password);

      const emailService = new EmailService({ logger: req.logger });
      await emailService.sendVerifyEmail(user);

      //not show token
      const result = R.omit(['verificationToken'], user);
      res.status(200).json(resSuccess(result));
    } catch (err) {
      next(err);
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { id } = req.user;
      const userService = new UserService({ logger: req.logger });
      const user = await userService.signIn(id);
      res.status(200).json(resSuccess(user));
    } catch (err) {
      next(err);
    }
  },
  verifyEmail: async (req, res, next) => {
    try {
      const token = req.body.token;

      // verify user
      const userService = new UserService({ logger: req.logger });
      await userService.verifyEmail(token);
      res.status(200).json(resSuccess());
    } catch (err) {
      next(err);
    }
  },
  resendVerifyEmail: async (req, res, next) => {
    try {
      const user = req.user;

      // judge status
      if (user.status === statusMap.active)
        throw new GeneralError(resendVerifyEmailErrorMap['alreadyVerified']);
      if (user.status === statusMap.inactive)
        throw new GeneralError(resendVerifyEmailErrorMap['inactive']);

      // refresh token
      const userService = new UserService({ logger: req.logger });
      const newToken = await userService.flushToken(user.id);
      const userData = {
        email: user.email,
        name: user.name,
        verificationToken: newToken,
      };

      // send verify email
      const emailService = new EmailService({ logger: req.logger });
      await emailService.sendVerifyEmail(userData);
      res.status(200).json(resSuccess());
    } catch (err) {
      next(err);
    }
  },

  getUserMe: async (req, res, next) => {
    try {
      const { id } = req.user;
      const userService = new UserService({ logger: req.logger });
      const userInfo = await userService.getUserInfo(id);
      res.status(200).json(resSuccess(userInfo));
    } catch (err) {
      next(err);
    }
  },

  updateMe: async (req, res, next) => {
    try {
      const { id } = req.user;
      const { name } = req.body;

      const userService = new UserService({ logger: req.logger });
      const user = await userService.updateUser(id, { name });

      res.status(200).json(resSuccess(user));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
