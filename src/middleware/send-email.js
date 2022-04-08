const SibApiV3Sdk = require('sib-api-v3-sdk');
const { sibKey } = require('../config/config');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = sibKey;

let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

sendSmtpEmail.subject = 'My {{params.subject}}';
sendSmtpEmail.htmlContent =
  '<html><body><h1>This is my first transactional email {{params.parameter}}</h1></body></html>';
sendSmtpEmail.sender = {
  name: 'ronny chiang',
  email: 'ronnychiang1164@gmail.com',
};
sendSmtpEmail.to = [
  { email: 'ronnychiang1164@gmail.com', name: 'cobras cobras' },
];
sendSmtpEmail.cc = [{ email: 'example2@example2.com', name: 'Janice Doe' }];
sendSmtpEmail.bcc = [{ email: 'John Doe', name: 'example@example.com' }];
sendSmtpEmail.replyTo = { email: 'replyto@domain.com', name: 'John Doe' };
sendSmtpEmail.headers = { 'Some-Custom-Name': 'unique-id-1234' };
sendSmtpEmail.params = { parameter: 'My param value', subject: 'New Subject' };

apiInstance.sendTransacEmail(sendSmtpEmail).then(
  function (data) {
    console.log(sibKey);
    console.log(
      'API called successfully. Returned data: ' + JSON.stringify(data)
    );
  },
  function (error) {
    console.error(error);
  }
);

module.exports = apiInstance;
