function resWithPagination(data, dataName, cursorId) {
  const result = {};

  result[dataName] = data;
  result.pagination = {
    cursorId: cursorId,
  };

  return result;
}

module.exports = resWithPagination;
