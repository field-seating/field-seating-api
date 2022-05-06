const aws = require('aws-sdk');
const fs = require('fs');
const {
  doKey,
  doSecret,
  doEndpoint,
  doBucket,
} = require('../../config/config');

const s3 = new aws.S3({
  endpoint: doEndpoint,
  accessKeyId: doKey,
  secretAccessKey: doSecret,
});

async function uploadS3(file, bucket, resizeFile) {
  const fileStream = fs.createReadStream(file.path);
  const params = {
    Bucket: `${doBucket}/${bucket}`,
    Key: resizeFile.name ? resizeFile.name : file.newFilename,
    Body: resizeFile.buffer ? resizeFile.buffer : fileStream,
    ACL: 'public-read',
    ContentType: file.mimetype,
  };
  return s3.upload(params).promise();
}

module.exports = {
  uploadS3,
};
