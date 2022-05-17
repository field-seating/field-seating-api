const sharp = require('sharp');
const PrivateError = require('../../errors/error/private-error');

async function resizeImages(file, options, format) {
  // to return info for upload
  const resizeFiles = [];

  await Promise.all(
    options.map(async (option) => {
      await sharp(file.buffer)
        .resize(option.size)
        .toFormat(format)
        .jpeg({ quality: 90 })
        .toBuffer({ resolveWithObject: true })
        .then((data) => {
          data.filename = `${option.name}${file.newFilename}`;
          resizeFiles.push(data);
        })
        .catch((err) => {
          throw new PrivateError(err);
        });
    })
  );
  return resizeFiles;
}

module.exports = {
  resizeImages,
};
