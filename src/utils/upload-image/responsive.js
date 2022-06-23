const { toPairs, mergeRight, reduce, map } = require('ramda');

const resizeInfoShaper = ({ filename }) =>
  map(([flag, config]) => {
    return {
      config,
      filename: `${flag}/${filename}`,
    };
  });

const datasetShaper = ({ assetDomain, bucketName, filename }) =>
  reduce((acc, [flag]) => {
    return mergeRight(acc, {
      [flag]: `${assetDomain}/${bucketName}/${flag}/${filename}`,
    });
  }, {});

const renderHelper = (shaper) => (sizeMap) => {
  return (localParams) => shaper(localParams)(toPairs(sizeMap));
};

module.exports = {
  renderResizeInfo: renderHelper(resizeInfoShaper),
  renderDataset: renderHelper(datasetShaper),
};
