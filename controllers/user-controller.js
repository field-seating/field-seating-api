const userServices = require('../services/user-service');

const userController = {
  signUp: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const user = await userServices.signUp(name, email, password);
      res.status(200).json({ status: 'success', data: user });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
