const formidable = require("formidable");

module.exports = function register(data) {
  const forbiddenUsernames = [
    "profile",
    "friends",
    "dictionary",
    "forgotpassword",
    "changepassword",
    "verify",
  ];

  const { username, password, name, email } = data;
  if (!name || !email || !password || !username)
    return "Please enter all fields.";
  const usernameRegEx = new RegExp("^[a-z0-9]+$");
  if (!usernameRegEx.test(username)) {
    return "Username has to contain letters a-z and numbers 0-9.";
  }
  if (forbiddenUsernames.includes(username)) {
    return `Username ${username} is forbidden.`;
  }
  if (username.length < 8 || username.length > 20)
    return "Username has to be 8-20 characters long.";
  if (password.length < 6)
    return "Password has to be at least 6 characters long.";
  return 0;
};
