const postPhotoErrorMap = {
  tooManyPhotos: {
    message: '超過單一上傳數量限制',
    code: 'p001',
  },
  weNeedPhoto: {
    message: '請上傳照片檔案',
    code: 'p002',
  },
  wrongSpaceId: {
    message: '此座位不存在',
    code: 'p003',
  },
  tooLargeFile: {
    message: '檔案大小超過限制',
    code: 'p004',
  },
  duplicatePath: {
    message: 'Path已經存在',
    code: 'p005',
  },
  exceedLimitError: {
    message: '您已超出一天內50次的上傳限額',
    code: 'p006',
  },
};

module.exports = postPhotoErrorMap;
