const sendEmail = require('../src/services/helpers/send-email');

const templateName = 'verify-email';

const meta = {
  receiverList: [
    {
      email: 'cuk.bas@gmail.com',
      name: 'Wendell',
    },
  ],
  subject: '帳號驗證信',
};

const data = {
  name: 'Wendell',
  email: 'cuk.bas@gmail.com',
  url: 'https://example.com',
};

sendEmail(templateName, meta, data)
  .then((resp) => {
    console.log('resp', resp);
    console.log('Email sent');
  })
  .catch((error) => {
    console.error(error);
    console.log(error.response.body);
  });
