const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const sharp = require('sharp');
const randomFilename = require('../middleware/random-filename');
const { doSecret } = require('../config/config');

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb('Please upload only images !', false);
//   }
// };
// const spaceEndpoint = aws.Endpoint('sgp1.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: 'sgp1.digitaloceanspaces.com',
  accessKeyId: 'GGIOMIDOYYVZRNGAXXWS',
  secretAccessKey: doSecret,
});
const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'field-seating/photos',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      console.log(file);
      cb(null, {
        fieldname: file.fieldname,
      });
    },
    key: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
  // fileFilter: multerFilter,
});
const newFilename = async () => {
  const result = await randomFilename();
  console.log(result);
  return result;
};
newFilename;
console.log(newFilename);
const uploadFiles = upload.array('images', 3);

const uploadImages = (req, res, next) => {
  console.log('one', req.body);
  uploadFiles(req, res, (err) => {
    console.log('two', req.body);
    console.log('goupload');
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
  console.log('goresize');
  console.log(req.body);
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
      req.body = {
        ...req.body,
        filename: filename,
      };
    })
  );

  next();
};

module.exports = {
  uploadImages,
  resizeImages,
};
