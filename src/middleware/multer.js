const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3-transform');
const sharp = require('sharp');
const randomFilename = require('../middleware/random-filename');
const { doKey, doSecret, doEndpoint } = require('../config/config');

const s3 = new aws.S3({
  endpoint: doEndpoint,
  accessKeyId: doKey,
  secretAccessKey: doSecret,
});
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'field-seating/photos',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    shouldTransform: async function (req, file, cb) {
      (file.originalname = await randomFilename()),
        cb(null, /^image/i.test(file.mimetype));
    },
    transforms: [
      {
        id: 'large',
        key: function (req, file, cb) {
          cb(null, file.originalname);
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(6400));
        },
      },
      {
        id: 'thumbnail',
        key: function (req, file, cb) {
          cb(null, `thumb_${file.originalname}`);
        },
        transform: function (req, file, cb) {
          cb(null, sharp().resize(640));
        },
      },
    ],
  }),
});

const uploadFiles = upload.array('images', 3);

const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    console.log(err);
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

module.exports = {
  uploadImages,
};
