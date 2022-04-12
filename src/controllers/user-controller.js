const userServices = require('../services/user-service');
const emailService = require('../services/email-service');
const resSuccess = require('./helpers/response');

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const user = await userServices.signUp(name, email, password);
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
      const user = await userServices.signIn(id);
      res.status(200).json(resSuccess(user));
    } catch (err) {
      next(err);
    }
  },
  verifyUser: async (req, res, next) => {
    try {
      const token = req.params.token;
      const user = await userServices.verifyUser(token);
      res.status(200).json(resSuccess(user));
    } catch (err) {
      next(err);
    }
  },
  sendVerifyEmail: async (req, res, next) => {
    try {
      const user = req.user;
      const sendVerifyEamil = await emailService.sendVerifyEmail(user);
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
