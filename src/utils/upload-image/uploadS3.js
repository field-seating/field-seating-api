const aws = require('aws-sdk');
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

async function uploadS3(file, bucket) {
  const params = {
    Bucket: `${doBucket}/${bucket}`,
    Key: file.filename,
    Body: file.data,
    ACL: 'public-read',
    ContentType: `image/${file.info.format}`,
  };
  return s3.upload(params).promise();
}

module.exports = {
  uploadS3,
};
