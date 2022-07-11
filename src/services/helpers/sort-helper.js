const { orderMap } = require('../../services/space-service/constant');
function sortHelper(data, order, prop) {
  if (order === orderMap.desc) return data.sort((a, b) => b[prop] - a[prop]);
  if (order === orderMap.asc) return data.sort((a, b) => a[prop] - b[prop]);
}

module.exports = {
  sortHelper,
};
