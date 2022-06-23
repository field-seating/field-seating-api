const { toPairs, mergeRight, reduce, map, compose } = require('ramda');

const renderResizeInfo =
  (sizeMap) =>
  ({ filename }) =>
    compose(
      map(([flag, config]) => {
        return {
          config,
          filename: `${flag}/${filename}`,
        };
      }),
      toPairs
    )(sizeMap);

const renderDataset =
  (sizeMap) =>
  ({ assetDomain, bucketName, path }) =>
    compose(
      reduce((acc, [flag]) => {
        return mergeRight(acc, {
          [flag]: `${assetDomain}/${bucketName}/${flag}/${path}`,
        });
      }, {}),
      toPairs
    )(sizeMap);

module.exports = {
  renderResizeInfo,
  renderDataset,
};
