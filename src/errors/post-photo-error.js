const postPhotoErrorMap = {
  toManyPhotos: {
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
  toLargeFile: {
    message: '檔案大小超過限制',
    code: 'p004',
  },
  duplicatePath: {
    message: 'Path已經存在',
    code: 'p005',
  },
};

module.exports = postPhotoErrorMap;
