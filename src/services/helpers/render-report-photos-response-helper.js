const R = require('ramda');
const { assetDomain } = require('../../config/config');
const { renderDataset } = require('../../utils/upload-image/responsive');

function renderReportPhotosResponse(dataList, sizeMap, bucketMap) {
  const dataSetFunc = renderDataset(sizeMap);

  const combineDataList = dataList.map((data) => {
    // size dataset
    const dataset = dataSetFunc({
      path: data.photo.path,
      bucketName: bucketMap,
      assetDomain,
    });

    const combineData = {
      ...data,
      dataset,
    };

    const result = R.omit(['photo'], combineData);
    return result;
  });
  return combineDataList;
}

module.exports = renderReportPhotosResponse;
