const sharp = require('sharp');

async function resizeImages(file, resizeInfoList) {
  const resizeFiles = await Promise.all(
    resizeInfoList.map(async ({ config, filename }) => {
      const result = await sharp(file.buffer)
        .resize(config.resizeOption)
        .toFormat(config.format, config.formatOption)
        .toBuffer({ resolveWithObject: true })
        .then((data) => {
          data.filename = filename;
          return data;
        });

      return result;
    })
  );
  return resizeFiles;
}

module.exports = resizeImages;
