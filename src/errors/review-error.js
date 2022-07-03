const reviewErrorMap = {
  alreadyReview: {
    message: '你已經評價過此照片',
    code: 're001',
  },
  notReviewYet: {
    message: '你未曾評價過此照片',
    code: 're002',
  },
  alreadyUnReview: {
    message: '你早已經取消此照片的評價',
    code: 're003',
  },
  badUnReviewRequest: {
    message: '你想取消的評價與之前評價的不同',
    code: 're004',
  },
};

module.exports = reviewErrorMap;
