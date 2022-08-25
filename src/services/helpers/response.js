function resWithPagination({
  dataName = 'data',
  data = null,
  cursorId = null,
} = {}) {
  const result = {};

  result[dataName] = data;
  result.pagination = {
    cursorId: cursorId,
  };

  return result;
}

module.exports = resWithPagination;
