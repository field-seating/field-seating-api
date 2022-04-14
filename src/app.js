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
const routes = require('./routes');
const { port } = require('./config/config');

const app = express();
const usedPort = port || 3000;

app.use(requestIdMiddleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // POST json格式
app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' })); // for check email format
app.set('view engine', 'hbs'); // for check email format

app.use(requestLogger);
app.use(responseLogger);

app.use(routes);
app.use(errorHandler);

app.get('/', (req, res) => res.send('Hello field-seating!'));

app.listen(usedPort, () => {
  logger.info(`App listening on port ${usedPort}`);
});
