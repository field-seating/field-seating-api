const SibApiV3Sdk = require('sib-api-v3-sdk');
var fs = require('fs');
var path = require('path');
const Handlebars = require('handlebars');
const { sibKey, emailSender, emailReceiver } = require('../../config/config');
let receiver = emailReceiver; // for dev

let defaultClient = SibApiV3Sdk.ApiClient.instance;
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = sibKey;

async function sendEmail(data) {
  // get template engine
  const templateStr = fs
    .readFileSync(path.resolve(__dirname, '../../../views/verify-email.hbs'))
    .toString('utf8');
  const template = Handlebars.compile(templateStr);

  // insert user data
  const info = {
    name: data.name,
    email: data.email,
    url: data.url,
  };

  // if production send to user
  if (process.env.NODE_MODULE === 'production') {
    receiver = data.email;
  }

  const result = template(info);
  const sib = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendInfo = await sib.sendTransacEmail({
    sender: { email: emailSender, name: '球場坐座Team' },
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
            email: receiver,
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

module.exports = sendEmail;
