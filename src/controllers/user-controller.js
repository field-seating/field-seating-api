const UserService = require('../services/user-service');
const resSuccess = require('./helpers/response');

const userController = {
  signUp: async (req, res, next) => {
    try {
      const userService = new UserService({ req });
      const { name, email, password } = req.body;
      const user = await userService.signUp(name, email, password);
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
  getUserInfo: async (req, res, next) => {
    try {
      const { id } = req.user;
      const userService = new UserService({ req });
      const user = await userService.getUserInfo(id);
      res.status(200).json(resSuccess(user));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
