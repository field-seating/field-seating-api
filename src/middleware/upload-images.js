const multer = require('multer');
const GeneralError = require('../errors/error/general-error');
const PrivateError = require('../errors/error/private-error');
const postPhotoErrorMap = require('../errors/post-photo-error');

const multerStorage = multer.memoryStorage();

// judge right file type
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new GeneralError(postPhotoErrorMap['weNeedPhoto']));
  }
};

// set upload to where
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
});

// upload way(single or many)
const uploadFiles = upload.array('images', 3); // limit 3 images

// upload
const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    if (!err) {
      next();
      return;
    }
    if (
      err instanceof multer.MulterError &&
      err.code === 'LIMIT_UNEXPECTED_FILE'
    ) {
      next(new GeneralError(postPhotoErrorMap['tooManyPhotos']));
      return;
    }
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      next(new GeneralError(postPhotoErrorMap['tooLargeFile']));
      return;
    }
    if (err.code === 'p002') {
      next(new GeneralError(err));
    }
    // others err we don't know
    next(new PrivateError(err));
  });
};

module.exports = {
  uploadImages,
};
