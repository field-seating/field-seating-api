const morgan = require('morgan');
const logger = require('../config/logger');
const { evolve, reduce, always } = require('ramda');

const sensitiveKeyList = ['password'];
const transformations = reduce(
  (acc, key) => ({
    ...acc,
    [key]: always('********'),
  }),
  {},
  sensitiveKeyList
);
const bodySanitizer = evolve(transformations);

const requestLogger = morgan((token, req) => {
  const body = req.body;
  const url = req.url;
  const requestId = req.requestId;

  logger.info('request in', {
    requestId,
    body: bodySanitizer(body),
    url,
  });
});

module.exports = requestLogger;
