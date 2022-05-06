const multer = require('multer');
const GeneralError = require('../errors/error/general-error');
const PrivateError = require('../errors/error/private-error');
const postPhotoErrorMap = require('../errors/post-photo-error');

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
  dest: 'temp/',
  fileFilter: multerFilter,
});

// upload way(single or many)
const uploadFiles = upload.array('images', 3); // limit 3 images

// upload
const uploadImages = (req, res, next) => {
  uploadFiles(req, res, (err) => {
    //  exceed limit
    if (
      err instanceof multer.MulterError &&
      err.code === 'LIMIT_UNEXPECTED_FILE'
    ) {
      next(new GeneralError(postPhotoErrorMap['toManyPhotos']));
    } else if (err) {
      // file type error
      if (err.code === 'p002') {
        next(new GeneralError(err));
      } else {
        // other we don't know
        next(new PrivateError(err));
      }
    }
    next();
  });
};

module.exports = {
  uploadImages,
};
