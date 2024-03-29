const express = require('express');
const exphbs = require('express-handlebars'); // for check email format

const logger = require('./config/logger');
const errorHandler = require('./middleware/error-handler');
const responseLogger = require('./middleware/response-logger');
const requestLogger = require('./middleware/request-logger');
const requestIdMiddleware = require('./middleware/request-id');
const buildVersionMiddleware = require('./middleware/build-version');
const requestTimeMiddleware = require('./middleware/request-time');
const dependenciesMiddleware = require('./middleware/dependencies-middleware');
const reqRateLimitMiddleware = require('./middleware/req-rate-limit-middleware');
const routes = require('./routes');
const { port } = require('./config/config');
const { isDevelopmentBuild, getEnv } = require('./context');
const resSuccess = require('./controllers//helpers/response');

const app = express();
const usedPort = port || 3000;

app.use(reqRateLimitMiddleware);
app.use(buildVersionMiddleware);
app.use(requestIdMiddleware);
app.use(requestTimeMiddleware);
app.use(dependenciesMiddleware);

app.use(express.urlencoded({ extended: true }));

app.use(express.json()); // POST json格式

// for check email format
if (isDevelopmentBuild()) {
  app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
  app.set('view engine', 'hbs');
}

app.use(requestLogger);
app.use(responseLogger);

app.use(routes);
app.use(errorHandler);

app.get('/health', (_, res) =>
  res.status(200).json(resSuccess('server is running'))
);

app.listen(usedPort, async () => {
  logger.info(`App listening on port ${usedPort}`, { appEnv: getEnv() });
});
