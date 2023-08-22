const nodemailer = require('nodemailer')

async function sendEmail(prisma, requestId, email) {
  try {

    // Create a transporter using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'your_email@gmail.com', // Your Gmail email
        pass: 'etoprapxgvbmtzkq' // Your Gmail password or App-specific password
      }
    });

    const attachment = {
      filename: requestId + '.zip',
      path: `/usr/src/app/out/${requestId}.zip`
    };

    let info = await transporter.sendMail({
      from: '"Your Name" <kgaras.service@gmail.com>',
      to: email, 
      subject: 'Hello from Nodemailer', // Subject line
      text: 'This is a test email', // Plain text body
      html: '<b>This is a test email</b>', // HTML body
      attachments: [attachment] // Add the attachment to the email
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = {
  sendEmail
}