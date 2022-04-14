const SibApiV3Sdk = require('sib-api-v3-sdk');
var fs = require('fs');
var path = require('path');
const Handlebars = require('handlebars');
const { sibKey } = require('../../config/config');

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = sibKey;

async function sendEamil(data) {
  const templateStr = fs
    .readFileSync(path.resolve(__dirname, '../../../views/verify-email.hbs'))
    .toString('utf8');
  const template = Handlebars.compile(templateStr);

  const info = {
    name: data.name,
    email: data.email,
    url: data.url,
  };
  const result = template(info);
  const sib = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendInfo = await sib.sendTransacEmail({
    sender: { email: 'ronnychiang1164@gmail.com', name: '球場坐座Team' }, // email will change data.email
    subject: '球場坐座帳號驗證信',
    htmlContent: result,
    params: {
      greeting: 'This is the default greeting',
      headline: 'This is the default headline',
    },
    messageVersions: [
      {
        to: [
          {
            email: 'ronnychiang1164@gmail.com',
            name: 'Bob Anderson',
          },
        ],
      },
    ],
  });
  const returnData = {
    ...info,
    sibMessage: sendInfo.messageIds,
  };
  return returnData;
}

module.exports = sendEamil;
