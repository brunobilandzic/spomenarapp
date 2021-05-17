const nodemailer = require("nodemailer");
const config = require("../config");

module.exports = function sendPasswordResetLink(to, link) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: config.EMAIL,
      pass: config.EMAIL_PASS,
    },
  });
  let message = {
    from: config.EMAIL,
    to: to.email,
    subject: "Password Reset",
    html: `
        <h1>Password Reset</h1>
        <p>Hello <b>${to.username}</b></p>
        <p>In order to reset your password click on <a href=${link} target="_blank">this link</a></p>
    `,
  };
  transporter.sendMail(message, (err, info) => {
    if (err) console.log(err);
    else console.log(info);
  });
};
