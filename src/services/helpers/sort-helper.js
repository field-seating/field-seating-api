const { orderMap } = require('../../services/space-service/constant');
function sortHelper(data, order) {
  if (order === orderMap.desc)
    return data.sort((a, b) => b.netUsefulCount - a.netUsefulCount);
  if (order === orderMap.asc)
    return data.sort((a, b) => a.netUsefulCount - b.netUsefulCount);
}

module.exports = {
  sortHelper,
};
