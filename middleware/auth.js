const config = require("../config");
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const token = req.header("x-auth-token");
  console.log(token);
  console.log(req.body);
  console.log(req.path);
  if (!token) return res.status(401).json({ msg: "Unauthorized request." });
  try {
    // verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ msg: "Token not valid" });
  }
};
