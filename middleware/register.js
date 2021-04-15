module.exports = function register(req, res, next) {
  const forbiddenUsernames = [
    "profile",
    "friends",
    "dictionary",
    "forgotpassword",
    "changepassword",
    "verify",
  ];
  const { username, password, name, email } = req.body;
  if (!name || !email || !password || !username)
    return res.status(400).json({ msg: "Please enter all fields." });
  const usernameRegEx = new RegExp("^[a-z0-9]+$");
  if (!usernameRegEx.test(username)) {
    return res
      .status(400)
      .json({ msg: "Username has to contain letters a-z and numbers 0-9." });
  }
  if (forbiddenUsernames.includes(username)) {
    return res.status(400).json({ msg: `Username ${username} is forbidden.` });
  }
  if (username.length < 8 || username.length > 20)
    return res
      .status(400)
      .json({ msg: "Username has to be 8-20 characters long." });
  if (password.length < 6)
    return res
      .status(400)
      .json({ msg: "Password has to be at least 6 characters long." });
  next();
};
