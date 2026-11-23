const sendEmail = require("./send");

module.exports = function sendVerificationLink(user, link) {
  return sendEmail({
    to: user.email,
    subject: "Verify your account",
    text: `Open this link to verify your email address.\n\n${link}`,
    html: `<p><a href="${link}">Verify your account</a></p>`,
  });
};
