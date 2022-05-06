const sharp = require('sharp');

async function resizeImages(file) {
  // to return info for upload
  const buffers = [];

  // resize thumbnail
  await sharp(file.path)
    .resize(640)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer()
    .then((buffer) => {
      // return info for upload
      buffers.push({
        name: `thumb_${file.newFilename}`,
        buffer,
      });
    });

  // resize large
  await sharp(file.path)
    .resize(3200)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toBuffer()
    .then((buffer) => {
      // return info for upload
      buffers.push({
        name: file.newFilename,
        buffer,
      });
    });
  // return info for upload
  return buffers;
}

module.exports = {
  resizeImages,
};
