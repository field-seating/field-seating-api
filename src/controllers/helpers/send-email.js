const SibApiV3Sdk = require('sib-api-v3-sdk');
var fs = require('fs');
var path = require('path');
const Handlebars = require('handlebars');
const { sibKey } = require('../../config/config');
const GeneralError = require('../../controllers/helpers/general-error');
const sendEmailErrorMap = require('../../errors/send-email-error');

let defaultClient = SibApiV3Sdk.ApiClient.instance;

let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = sibKey;

const sendVerifyEamil = async (data) => {
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

  const sendEmail = new SibApiV3Sdk.TransactionalEmailsApi();
  try {
    const sendInfo = await sendEmail.sendTransacEmail({
      sender: { email: 'ronnychiang1164@gmail.com', name: 'Sendinblue' }, // email will change data.email
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
    return sendInfo.messageIds;
  } catch (err) {
    if (err) throw new GeneralError(sendEmailErrorMap['sendEmailError']);
  }

  // function (error) {
  //   console.error(error);
  //   if (error) throw new GeneralError(sendEmailErrorMap['sendEmailError']);
  // }

  // new SibApiV3Sdk.TransactionalEmailsApi()
  //   .sendTransacEmail({
  //     sender: { email: 'ronnychiang1164@gmail.com', name: 'Sendinblue' }, // email will change data.email
  //     subject: '球場坐座帳號驗證信',
  //     htmlContent: result,
  //     params: {
  //       greeting: 'This is the default greeting',
  //       headline: 'This is the default headline',
  //     },
  //     messageVersions: [
  //       {
  //         to: [
  //           {
  //             email: 'ronnychiang1164@gmail.com',
  //             name: 'Bob Anderson',
  //           },
  //         ],
  //       },
  //     ],
  //   })
  //   .then(
  //     function (data) {
  //       console.log(data);
  //       return data;
  //     },
  //     function (error) {
  //       console.error(error);
  //       if (error) throw new GeneralError(sendEmailErrorMap['sendEmailError']);
  //     }
  //   );
};

module.exports = sendVerifyEamil;
