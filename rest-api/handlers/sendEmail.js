const nodemailer = require('nodemailer')

async function sendEmail(requestId, email) {
  try {

    // Create a transporter using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'kgaras.service@gmail.com', // Your Gmail email
        pass: 'etoprapxgvbmtzkq' // Your Gmail password or App-specific password
      }
    });

    const attachment = {
      filename: requestId + '.zip',
      path: `/app/outputs/${requestId}.zip`
    };

    let info = await transporter.sendMail({
      from: '"Your Name" <kgaras.service@gmail.com>',
      to: email, 
      subject: 'Knowledge Graph Alignment Result', // Subject line
      text: 'Here is the result of the knowledge graph alignment:', // Plain text body
      html: `<p><b>Here is the result of the knowledge graph alignment:</b></p><pre>${requestId}</pre>`, // HTML body
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