const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = function authUser(user, next) {
  jwt.sign(
    { username: user.username, id: user._id },
    config.JWT_SECRET,
    { expiresIn: 3600 },
    (err, token) => {
      if (err) throw err;
      let userData = { ...user._doc };
      next({
        token,
        user: {
          username: userData.username,
          id: userData._id,
          verified: userData.verified,
          name: userData.name,
          email: userData.email,
        },
      });
    }
  );
};
