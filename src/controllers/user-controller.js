const emailService = require('../services/email-service');
const UserService = require('../services/user-service');
const resSuccess = require('./helpers/response');
const GeneralError = require('../errors/error/general-error');
const verifyErrorMap = require('../errors/verify-error');

const userController = {
  signUp: async (req, res, next) => {
    try {
      const userService = new UserService({ req });
      const { name, email, password } = req.body;
      const user = await userService.signUp(name, email, password);
      let sendVerifyEamil = '';
      if (user) {
        sendVerifyEamil = await emailService.sendVerifyEmail(user);
      }
      const newUser = {
        ...user,
        sendEmail: sendVerifyEamil,
      };
      res.status(200).json(resSuccess(newUser));
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
  verifyUser: async (req, res, next) => {
    try {
      const token = req.params.token;
      // update user status
      const userService = new UserService({ req });
      const user = await userService.verifyUser(token);
      res.status(200).json(resSuccess(user));
    } catch (err) {
      next(err);
    }
  },
  sendVerifyEmail: async (req, res, next) => {
    try {
      const user = req.user;
      // 判斷是否verified
      if (user.status === 'verified')
        throw new GeneralError(verifyErrorMap['alreadyVerified']);
      // send verify email
      const sendVerifyEamil = await emailService.sendVerifyEmail(user);
      // return info
      const newUser = {
        ...user,
        sendEmail: sendVerifyEamil,
      };
      res.status(200).json(resSuccess(newUser));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
