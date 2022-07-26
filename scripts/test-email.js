const sgMail = require('@sendgrid/mail');

const {
  sendgridApiKey,
  mailSender,
  sendgridSandboxMode,
} = require('../src/config/config');

sgMail.setApiKey(sendgridApiKey);

const msg = {
  to: 'cuk.bas@gmail.com', // Change to your recipient
  from: mailSender.general, // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: "It's a mail from field seating",
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  mailSettings: {
    sandboxMode: {
      enable: sendgridSandboxMode,
    },
  },
};

sgMail
  .send(msg)
  .then((resp) => {
    console.log('resp', resp);
    console.log('Email sent');
  })
  .catch((error) => {
    console.error(error);
    console.log(error.response.body);
  });
