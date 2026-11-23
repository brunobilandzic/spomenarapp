const sendEmail = require("./send");

module.exports = function sendPasswordResetLink(user, link) {
  return sendEmail({
    to: user.email,
    subject: "Reset your password",
    text: `Open this link to reset your password.\n\n${link}`,
    html: `<p><a href="${link}">Reset your password</a></p>`,
  });
};
