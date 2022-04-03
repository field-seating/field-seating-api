const userServices = require('../services/user-service');
const resSuccess = require('./helpers/response');

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const user = await userServices.signUp(name, email, password);
      res.status(200).json(resSuccess(user));
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
};

module.exports = userController;
