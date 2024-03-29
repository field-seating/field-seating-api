const { evolve, reduce, always } = require('ramda');

const sensitiveKeyList = ['password', 'token'];
const transformations = reduce(
  (acc, key) => ({
    ...acc,
    [key]: always('********'),
  }),
  {},
  sensitiveKeyList
);
const bodySanitizer = evolve(transformations);

module.exports = {
  bodySanitizer,
};
