const SibApiV3Sdk = require('sib-api-v3-sdk');
var fs = require('fs');
var path = require('path');
const Handlebars = require('handlebars');
const { sibKey } = require('../../config/config');
const PrivateError = require('../../errors/error/private-error');
const sendEmailErrorMap = require('../../errors/send-email-error');
const R = require('ramda');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = sibKey;

async function sendEmail(templateName, meta, data) {
  // check
  for (let i = 0; i < meta.receiverList.length; i++) {
    if (
      R.isNil(meta.receiverList[i].email) ||
      R.isEmpty(meta.receiverList[i].email)
    )
      throw new PrivateError(sendEmailErrorMap['noEmailAddressError']);
  }
  if (!R.is(String, templateName) || R.isEmpty(templateName))
    throw new PrivateError(sendEmailErrorMap['templateNameError']);

  // get template engine
  const templateStr = fs
    .readFileSync(path.resolve(__dirname, `../../../views/${templateName}.hbs`))
    .toString('utf8');
  const template = Handlebars.compile(templateStr);

  const receiver = meta.receiverList;

  const result = template(data);
  console.log(result);
  console.log(receiver);
  const sib = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendInfo = await sib.sendTransacEmail({
    sender: { email: 'ronnychiang1164@gmail.com', name: '球場坐座Team' },
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
