if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');
const { apiErrorHandler } = require('./middleware/error-handler');
const { resLogger } = require('./middleware/response-logger');
const routes = require('./routes');
const { port } = require('./config/config');
const app = express();
const usedPort = port || 3000;

morgan.token('body', (req) => {
  return JSON.stringify(req.body);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // POST json格式
app.use(morgan(':method :url :body', { stream: logger.stream }));
app.use(routes);
app.use(apiErrorHandler);
app.use(resLogger);
app.get('/', (req, res) => res.send('Hello field-seating!'));
app.listen(usedPort, () => {
  logger.info(`example app listening on port ${usedPort}!`);
  logger.error('error demo');
});
