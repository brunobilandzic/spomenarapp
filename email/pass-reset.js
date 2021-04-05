const nodemailer = require("nodemailer");
const config = require("../config");

module.exports = function sendPasswordResetLink(to, link, res) {
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
    subject: "Password Reset",
    html: `
        <h1>Password Reset</h1>
        <p>Hello <b>${to.username}</b></p>
        <p>In order to reset your password click on <a href=${link} target="_blank">this link</a></p>
    `,
  };
  transporter.sendMail(message, (err, info) => {
    if (err) throw err;
    `return res.status(500).json({
        msg: "Something went wrong. Try again or contact support.",
        err,
      });`;
    console.log(info);
    return res.json({
      msg: `Email to ${to.email} with directions to reset password is sent.`,
    });
  });
};