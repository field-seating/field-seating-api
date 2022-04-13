const { format } = require('winston');
const { mergeRight } = require('ramda');

const timestampFormatter = format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' });

const jsonStructureFormatter = format.printf(
  ({ timestamp, level, message, requestId, ...rest }) => {
    const requestIdOutput = requestId ? { requestId } : {};

    const output = mergeRight(
      {
        level,
        message,
        ...rest,
        timestamp: timestamp,
      },
      requestIdOutput
    );

    return `${JSON.stringify(output)}`;
  }
);

module.exports = {
  timestampFormatter,
  jsonStructureFormatter,
};
