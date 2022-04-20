const multer = require('multer');
const sharp = require('sharp');
const randomFilename = require('../middleware/random-filename');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  console.log(file);
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb('Please upload only images !', false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadFiles = upload.array('images', 3);

const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.send('Too many files to upload !');
      }
    } else if (err) {
      return res.send(err);
    }

    next();
  });
};

const resizeImages = async (req, res, next) => {
  if (!req.files) return next();
  req.body.images = [];
  await Promise.all(
    req.files.map(async (file) => {
      console.log(file);
      const filename = await randomFilename();
      console.log(filename);
      const newFilename = `${filename}.jpeg`;

      await sharp(file.buffer)
        .resize(640)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`upload/thumbnail-${newFilename}`);

      req.body.images.push(newFilename);

      await sharp(file.buffer)
        .resize(6400)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`upload/large-${newFilename}`);

      req.body.images.push(newFilename);
    })
  );

  next();
};

module.exports = {
  uploadImages,
  resizeImages,
};
