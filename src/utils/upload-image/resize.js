const sharp = require('sharp');

async function resizeImages(file, options, format) {
  // to return info for upload
  const resizeFiles = [];

  await Promise.all(
    options.map(async (option) => {
      await sharp(file.buffer)
        .resize(option.size)
        .toFormat(format)
        .toBuffer({ resolveWithObject: true })
        .then((data) => {
          data.filename = `${option.namePrefix}${file.newFilename}`;
          resizeFiles.push(data);
        });
    })
  );
  return resizeFiles;
}

module.exports = {
  resizeImages,
};
