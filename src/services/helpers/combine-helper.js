const R = require('ramda');
const { bucketMap } = require('../../constants/upload-constant');
const { sizeMap } = require('../../constants/resize-constant');
const { assetDomain } = require('../../config/config');
const { renderDataset } = require('../../utils/upload-image/responsive');

function combine(dataList, mapData) {
  const dataSetFunc = renderDataset(sizeMap.seatPhoto);

  const combineDataList = dataList.map((data) => {
    const id = data.id.toString();

    // size dataset
    const dataset = dataSetFunc({
      path: data.path,
      bucketName: bucketMap.photos,
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

module.exports = { combine };
