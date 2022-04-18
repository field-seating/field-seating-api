const sendEmailErrorMap = {
  apiKeyError: {
    message: 'Unauthorized Make sure the provided api-key is correct',
    code: 'se001',
  },
  badRequestError: {
    message: 'Request is invalid. Check the error code in JSON',
    code: 'se002',
  },
  toManyRequestError: {
    message: 'The expected rate limit is exceeded',
    code: 'se003',
  },
  templateNameError: {
    message: 'need valid template name',
    code: 'se004',
  },
  noEmailAddressError: {
    message: 'need an email address',
    code: 'se005',
  },
  noSubjectError: {
    message: 'need an email subject',
    code: 'se005',
  },
};

module.exports = sendEmailErrorMap;
