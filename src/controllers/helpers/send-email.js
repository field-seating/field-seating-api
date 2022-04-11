const SibApiV3Sdk = require('sib-api-v3-sdk');
var fs = require('fs');
var path = require('path');
const Handlebars = require('handlebars');
const { sibKey } = require('../../config/config');
let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = sibKey;

const sendVerifyEamil = (data) => {
  const templateStr = fs
    .readFileSync(path.resolve(__dirname, '../../../views/verify-email.hbs'))
    .toString('utf8');
  const template = Handlebars.compile(templateStr);

  const info = {
    name: data.name,
    email: data.email,
    url: `http://localhost:3000/verify-email/${data.token}`,
  };
  const result = template(info);

  new SibApiV3Sdk.TransactionalEmailsApi()
    .sendTransacEmail({
      sender: { email: 'ronnychiang1164@gmail.com', name: 'Sendinblue' }, // email will change data.email
      subject: '球場坐座帳號驗證信',
      htmlContent: result,
      params: {
        greeting: 'This is the default greeting',
        headline: 'This is the default headline',
      },
      messageVersions: [
        //Definition for Message Version 1
        {
          to: [
            {
              email: 'ronnychiang1164@gmail.com',
              name: 'Bob Anderson',
            },
          ],
        },
      ],
    })
    .then(
      function (data) {
        console.log(data);
      },
      function (error) {
        console.error(error);
      }
    );
};

module.exports = sendVerifyEamil;
