const { map } = require('ramda');

const context = require('../context');

const bucketMap = {
  photos: 'photos',
};

const processedBucketMap = map(
  (bucketName) => `${context.getEnv()}/${bucketName}`
)(bucketMap);

module.exports = { bucketMap: processedBucketMap };
