if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const logger = require('./config/winston');
const { apiErrorHandler } = require('./middleware/error-handler');
const routes = require('./routes');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // POST json格式
app.use(routes);
app.use(morgan('combined', { stream: logger.stream }));
app.use(apiErrorHandler);
app.get('/', (req, res) => res.send('Hello field-seating!'));
app.listen(port, () => logger.info(`example app listening on port ${port}!`));

app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  logger.error(
    `${err.code || 500} - ${err.message} - ${req.originalUrl} - ${
      req.method
    } - ${req.ip}`
  );
});
