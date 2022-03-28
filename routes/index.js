const { apiErrorHandler } = require('../middleware/error-handler');
const testController = require('../controllers/test-controller');

module.exports = (app) => {
  app.post('/api/echo', testController.postEcho);
  app.use('/', apiErrorHandler);
};
