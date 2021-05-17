const config = require("../config");

module.exports = function admin(req, res, next) {
  const key = req.header("admin-key");
  console.log(key);
  console.log(config.ADMIN_KEY);
  if (key != config.ADMIN_KEY)
    return res.status(401).json({ msg: "Unauthorized request." });
  next();
};
