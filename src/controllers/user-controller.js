const EmailService = require('../services/email-service');
const UserService = require('../services/user-service');
const resSuccess = require('./helpers/response');
const GeneralError = require('../errors/error/general-error');
const verifyErrorMap = require('../errors/verify-error');
const { statusMap } = require('../models/user/constants');

const userController = {
  signUp: async (req, res, next) => {
    try {
      const userService = new UserService({ req });
      const { name, email, password } = req.body;
      const user = await userService.signUp(name, email, password);
      const emailService = new EmailService({ req });
      await emailService.sendVerifyEmail(user);
      res.status(200).json(resSuccess(user));
    } catch (err) {
      next(err);
    }
  },
  signIn: async (req, res, next) => {
    try {
      const { id } = req.user;
      const userService = new UserService({ req });
      const user = await userService.signIn(id);
      res.status(200).json(resSuccess(user));
    } catch (err) {
      next(err);
    }
  },
  verifyEmail: async (req, res, next) => {
    try {
      const token = req.body.token;
      // update user status
      const userService = new UserService({ req });
      const user = await userService.verifyEmail(token);
      res.status(200).json(resSuccess(user));
    } catch (err) {
      next(err);
    }
  },
  sendVerifyEmail: async (req, res, next) => {
    try {
      const user = req.user;
      // 判斷是否verified

      if (user.status === statusMap.active)
        throw new GeneralError(verifyErrorMap['alreadyVerified']);
      // send verify email
      const emailService = new EmailService({ req });
      await emailService.sendVerifyEmail(user);

      res.status(200).json(resSuccess());
    } catch (err) {
      next(err);
    }
  },
  getUserInfo: async (req, res, next) => {
    try {
      const { id } = req.user;
      const userService = new UserService({ req });
      const userInfo = await userService.getUserInfo(id);
      res.status(200).json(resSuccess(userInfo));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
