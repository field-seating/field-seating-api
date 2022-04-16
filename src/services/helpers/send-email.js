const SibApiV3Sdk = require('sib-api-v3-sdk');
var fs = require('fs');
var path = require('path');
const Handlebars = require('handlebars');
const { sibKey, email } = require('../../config/config');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = sibKey;

async function sendEmail(templateName, meta, data) {
  // get template engine
  const templateStr = fs
    .readFileSync(path.resolve(__dirname, `../../../views/${templateName}.hbs`))
    .toString('utf8');
  const template = Handlebars.compile(templateStr);

  let receiver = meta.emailList;
  // if notpro send to dev
  if (process.env.NODE_MODULE !== 'production') {
    receiver = [
      {
        email,
        name: 'devloper',
      },
    ];
  }

  const result = template(data);
  const sib = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendInfo = await sib.sendTransacEmail({
    sender: { email: email, name: '球場坐座Team' },
    subject: meta.subject,
    htmlContent: result,
    messageVersions: [
      {
        to: receiver,
      },
    ],
  });
  const returnData = {
    ...data,
    sibMessage: sendInfo.messageIds,
  };
  return returnData;
}

module.exports = sendEmail;
