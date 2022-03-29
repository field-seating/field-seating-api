if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const logger = require('./middleware/winston');
const routes = require('./routes');

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // POST json格式
app.use(routes);
app.get('/', (req, res) => res.send('Hello field-seating!'));
app.listen(port, () => logger.info(`example app listening on port ${port}!`));
