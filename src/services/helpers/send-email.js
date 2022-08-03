const fs = require('fs');
const path = require('path');

const sgMail = require('@sendgrid/mail');
const Handlebars = require('handlebars');

const {
  sendgridApiKey,
  mailSender,
  sendgridSandboxMode,
} = require('../../config/config');
const PrivateError = require('../../errors/error/private-error');
const sendEmailErrorMap = require('../../errors/send-email-error');
const R = require('ramda');

sgMail.setApiKey(sendgridApiKey);

const DEFAULT_TEXT = "It's a mail from field seating";

const mapMessageId = R.map(R.path(['headers', 'x-message-id']));

async function sendEmail(templateName, meta, data) {
  // check
  const isInvalidEmail = (receiver) =>
    R.isNil(receiver.email) || R.isEmpty(receiver.email);
  if (meta.receiverList.some(isInvalidEmail))
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

  const htmlContent = template(data);

  const enableSandboxMode = sendgridSandboxMode;

  try {
    const msg = {
      to: receiver,
      from: mailSender.general,
      subject: meta.subject,
      text: meta.text || DEFAULT_TEXT,
      html: htmlContent,
      mailSettings: {
        sandboxMode: {
          enable: enableSandboxMode,
        },
      },
    };

    const sendInfo = await sgMail.send(msg);

    const returnData = {
      ...data,
      messageIds: mapMessageId(sendInfo),
    };

    return returnData;
  } catch (err) {
    if (err.code === 401)
      throw new PrivateError(sendEmailErrorMap['apiKeyError']);
    if (err.code === 400)
      throw new PrivateError(sendEmailErrorMap['badRequestError']);
    if (err.code === 429)
      throw new PrivateError(sendEmailErrorMap['toManyRequestError']);
    throw err;
  }
}

module.exports = sendEmail;
