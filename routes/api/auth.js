const express = require("express");
const bcrypt = require("bcrypt");
const base64url = require("base64url");
const authUser = require("../../jwt");
const User = require("../../models/User");
const auth = require("../../middleware/auth");
const sendPasswordResetLink = require("../../email/pass-reset");
const router = express.Router();
const admin = require("../../middleware/admin");
const { APP_URL } = require("../../config");
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
      });
    })
    .catch((err) => res.status(400).json({ msg: "AUTH_ERROR" }));
});

// @route POST /api/auth/pwd
// @desc Password reset request
// @access Public
router.post("/pwd", async (req, res) => {
  const { userInfo } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: userInfo }, { username: userInfo }],
    });
    if (!user)
      return res.status(400).json({ msg: `User ${userInfo} not found.` });

    const hash = await bcrypt.hash(user.password, 10);
    const link = `${APP_URL}/resetpassword/${encodeURIComponent(user.username)}/${base64url(hash)}`;
    try {
      await sendPasswordResetLink(user, link);
    } catch (error) {
      console.error("Password reset email failed:", error.message);
      return res.status(502).json({ msg: "Could not send the password reset email. Please try again." });
    }
    return res.json({
      username: user.username,
      email: user.email,
    });
  } catch {
    return res.status(500).json({ msg: "Could not request a password reset." });
  }
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
