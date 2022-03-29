// eslint-disable-next-line no-undef
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 3000;
const logger = require('./middleware/winston');

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // POST json格式

require('./routes')(app);
app.get('/', (req, res) => res.send('Hello field-seating!'));
app.listen(port, () => logger.info(`example app listening on port ${port}!`));
