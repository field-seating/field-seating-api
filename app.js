if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const logger = require('./middleware/winston');
const { apiErrorHandler } = require('./middleware/error-handler');
const routes = require('./routes');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // POST json格式
app.use(routes);
app.use(apiErrorHandler);
app.get('/', (req, res) => res.send('Hello field-seating!'));
app.listen(port, () => logger.info(`example app listening on port ${port}!`));
