const sharp = require('sharp');

async function resizeImages(file, options, format) {
  // to return info for upload
  const resizeFiles = await Promise.all(
    options.map(async (option) => {
      const result = await sharp(file.buffer)
        .resize(option.size)
        .toFormat(format.format, { quality: format.quality })
        .toBuffer({ resolveWithObject: true })
        .then((data) => {
          data.filename = `${option.namePrefix}${file.newFilename}`;
          return data;
        });
      return result;
    })
  );
  return resizeFiles;
}

module.exports = {
  resizeImages,
};
