const express = require("express");
const bcrypt = require("bcrypt");
const base64url = require("base64url");
const authUser = require("../../jwt");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const sendPasswordResetLink = require("../../email/pass-reset");
const router = express.Router();
const admin = require("../../middleware/admin");
// @route POST /api/auth
// @desc Authorization (Login)
// @accsess Public
router.post("/", (req, res) => {
  const { user, password } = req.body;
  if (!user || !password)
    return res.status(400).json({ msg: "Please enter all fields" });
  User.findOne({ $or: [{ email: user }, { username: user }] }).then(
    (userFound) => {
      if (!userFound)
        return res.status(400).json({ msg: `User ${user} not found.` });
      if (!userFound.verified)
        return res
          .status(400)
          .json({ msg: `Verify your email on ${userFound.email}` });
      bcrypt.compare(password, userFound.password).then((isMatch) => {
        if (isMatch) {
          authUser(userFound, (authData) => {
            res.json(authData);
          });
        } else return res.status(401).json({ msg: "Wrong password." });
      });
    }
  );
});

// @route GET /api/auth/user
// @desc Get User Info Via Token
// @access Public
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((userData) => {
      res.json({
        username: userData.username,
        id: userData._id,
        verified: userData.verified,
        name: userData.name,
        email: userData.email,
        imageUrl: userData.imageUrl,
      });
    })
    .catch((err) => res.status(400).json({ msg: "AUTH_ERROR" }));
});

// @route POST /api/auth/pwd
// @desc Password reset request
// @access Public
router.post("/pwd", (req, res) => {
  const { userInfo } = req.body;
  User.findOne({
    $or: [{ email: userInfo }, { username: userInfo }],
  }).then((user) => {
    if (!user)
      return res.status(400).json({ msg: `User ${userInfo} not found.` });

    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) throw err;
        const link =
          req.protocol +
          "://" +
          req.hostname +
          ":3000/resetpassword/" +
          user.username +
          "/" +
          base64url(hash);
        sendPasswordResetLink(user, link);
        return res.json({
          username: user.username,
          email: user.email,
        });
      });
    });
  });
});

// @route POST /api/auth/passwordceck
// @desc Auth user and send password change grant hash
// @access Public
router.post("/passwordcheck", (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }).then((user) => {
    if (!user)
      return res.status(400).json({ msg: `User ${username} not found.` });
    if (!user.verified)
      return res
        .status(400)
        .json({ msg: `Verify your email on ${user.email}` });
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            return res.send(base64url(hash));
          });
        });
      } else return res.status(401).json({ msg: "Wrong password." });
    });
  });
});

// @route GET /api/auth/pwd/:username/:hash
// @desc Password reset email link resolve
// @access Public
router.get("/pwd/:username/:hash", (req, res) => {
  const { username, hash } = req.params;
  User.findOne({
    username,
  }).then((user) => {
    if (!user)
      return res.status(400).json({ msg: `User ${username} not found.` });
    bcrypt.compare(user.password, base64url.decode(hash), (err, isMatch) => {
      if (err) throw err;
      else if (isMatch) {
        return authUser(user, (authData) => {
          res.json(authData);
        });
      } else {
        return res.status(400).json({
          msg: "Wrong password activation link",
        });
      }
    });
  });
});

// @route POST /api/auth/pwd/newpwd
// @desc New Password Form resolve
// @access Public
router.post("/pwd/newpwd", (req, res) => {
  const { username, newPassword, hash } = req.body;
  User.findOne({
    username,
  }).then((user) => {
    if (!user)
      return res.status(400).json({ msg: `User ${username} not found.` });
    bcrypt.compare(user.password, base64url.decode(hash), (err, isMatch) => {
      if (err) throw err;
      else if (isMatch) {
        return bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user.save().then((user) => {
              authUser(user, (authData) => {
                res.json(authData);
              });
            });
          });
        });
      } else {
        return res.status(400).json({
          msg: "Wrong hash.",
        });
      }
    });
  });
});

module.exports = router;
