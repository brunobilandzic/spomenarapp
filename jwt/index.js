const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = function authUser(user, next) {
  jwt.sign(
    { username: user.username, id: user._id },
    config.JWT_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      userData = { ...user._doc };
      delete userData["password"];
      next({
        token,
        user: {
          ...userData,
        },
      });
    }
  );
};
