if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const logger = require('./config/logger');
const errorHandler = require('./middleware/error-handler');
const responseLogger = require('./middleware/response-logger');
const requestLogger = require('./middleware/request-logger');
const requestIdMiddleware = require('./middleware/request-id');
const routes = require('./routes');
const { port } = require('./config/config');

const app = express();
const usedPort = port || 3000;

app.use(requestIdMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // POST json格式

app.use(requestLogger);

app.use(routes);
app.use(errorHandler);
app.use(responseLogger);

app.get('/', (req, res) => res.send('Hello field-seating!'));

app.listen(usedPort, () => {
  logger.info(`example app listening on port ${usedPort}!`, {
    msg: 'obj msg',
  });
  logger.error('error demo');
});
