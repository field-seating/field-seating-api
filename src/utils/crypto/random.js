const crypto = require('crypto');

const randomString = async (length) => {
  return await new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(buf.toString('hex').slice(0, length));
    });
  });
};

module.exports = { randomString };
