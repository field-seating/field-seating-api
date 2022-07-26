const sgMail = require('@sendgrid/mail');

const { sendgridApiKey, mailSender } = require('../src/config/config');

sgMail.setApiKey(sendgridApiKey);

const msg = {
  to: 'cuk.bas@gmail.com', // Change to your recipient
  from: mailSender.general.email, // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
    console.error(error);
  });
