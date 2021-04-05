const nodemailer = require("nodemailer");
const config = require("../config");

module.exports = function sendVerificationLink(to, link) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: config.EMAIL, // generated ethereal user
      pass: config.EMAIL_PASS, // generated ethereal password
    },
  });
  let message = {
    from: config.EMAIL,
    to: to.email,
    subject: "Verify your account",
    html: `
        <h1>Hello there</h1>
        <p>Hello <b>${to.username}</b></p>
        <p>In order to activate your account click on <a href=${link} target="_blank">this link</a></p>
    `,
  };
  transporter.sendMail(message, (err, info) => {
    if (err) throw err;
    console.log(info);
  });
};
