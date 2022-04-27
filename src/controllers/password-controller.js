const resSuccess = require('./helpers/response');

const passwordController = {
  recoveryPassword: async (req, res, next) => {
    try {
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
