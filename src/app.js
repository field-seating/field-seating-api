if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const exphbs = require('express-handlebars'); // for check email format
const logger = require('./config/logger');
const errorHandler = require('./middleware/error-handler');
const responseLogger = require('./middleware/response-logger');
const requestLogger = require('./middleware/request-logger');
const requestIdMiddleware = require('./middleware/request-id');
const requestTimeMiddleware = require('./middleware/request-time');
const routes = require('./routes');
const { port } = require('./config/config');

const app = express();
const usedPort = port || 3000;

app.use(requestIdMiddleware);
app.use(requestTimeMiddleware);
app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // POST json格式

// for check email format
if (process.env.NODE_ENV !== 'production') {
  app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
  app.set('view engine', 'hbs');
}

app.use(requestLogger);
app.use(responseLogger);

app.use(routes);
app.use(errorHandler);

app.get('/', (req, res) => res.send('Hello field-seating!'));

app.listen(usedPort, () => {
  logger.info(`App listening on port ${usedPort}`);
});
