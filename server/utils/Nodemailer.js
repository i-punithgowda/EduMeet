var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
async function messenger(subject, message, email) {
  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "globalimsbank@gmail.com",
        pass: process.env.SMTP_PASS,
      },
    })
  );

  var mailOptions = {
    from: "globalimsbank@gmail.com",
    to: email,
    subject: subject,
    html: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = messenger;
