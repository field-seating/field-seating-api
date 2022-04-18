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
  const wrongMetaEmail = (event) =>
    R.isNil(event.email) || R.isEmpty(event.email);
  if (meta.receiverList.every(wrongMetaEmail))
    throw new PrivateError(sendEmailErrorMap['noEmailAddressError']);
  if (!R.is(String, meta.subject) || R.isEmpty(meta.subject))
    throw new PrivateError(sendEmailErrorMap['noSubjectError']);
  if (!R.is(String, templateName) || R.isEmpty(templateName))
    throw new PrivateError(sendEmailErrorMap['templateNameError']);

  // get template engine
  const templateStr = fs
    .readFileSync(path.resolve(__dirname, `../../../views/${templateName}.hbs`))
    .toString('utf8');
  const template = Handlebars.compile(templateStr);

  const receiver = meta.receiverList;

  const result = template(data);
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
