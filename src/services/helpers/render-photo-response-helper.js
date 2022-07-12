const R = require('ramda');
const { assetDomain } = require('../../config/config');
const { renderDataset } = require('../../utils/upload-image/responsive');

function renderPhotoResponse(dataList, mapData, sizeMap, bucketMap) {
  const dataSetFunc = renderDataset(sizeMap);

  const combineDataList = dataList.map((data) => {
    const id = data.id.toString();

    // size dataset
    const dataset = dataSetFunc({
      path: data.path,
      bucketName: bucketMap,
      assetDomain,
    });

    const combineData = {
      ...data,
      dataset,
      usefulCount: mapData[id] ? mapData[id].usefulCount : 0,
      uselessCount: mapData[id] ? mapData[id].uselessCount : 0,
      netUsefulCount: mapData[id] ? mapData[id].netUsefulCount : 0,
    };

    const result = R.omit(['path'], combineData);
    return result;
  });
  return combineDataList;
}

module.exports = renderPhotoResponse;
