const sharp = require('sharp');

async function resizeImages(file, resizeInfoList) {
  return await Promise.all(
    resizeInfoList.map(({ config, filename }) =>
      resizeImage({
        config,
        filename,
        buffer: file.buffer,
      })
    )
  );
}

const resizeImage = async ({ config, filename, buffer }) => {
  const result = await sharp(buffer)
    .rotate()
    .resize(config.resizeOption)
    .toFormat(config.format, config.formatOption)
    .toBuffer({ resolveWithObject: true })
    .then((data) => {
      data.filename = filename;
      return data;
    });
  return result;
};

module.exports = { resizeImages, resizeImage };
