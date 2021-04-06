const User = require("../../models/User");
const express = require("express");
const bcrypt = require("bcrypt");
const registerCheck = require("../../middleware/register");
const sendVerificationLink = require("../../email/verification");
const router = express.Router();
const base64url = require("base64url");
const authUser = require("../../jwt");
const config = require("../../config");
const { USER_NOT_FOUND } = require("../../config/errors");
// @route GET /api/users
// @desc Fetches all users in DB
// @access Public

router.get("/", (req, res) => {
  User.find()
    .then((users) => {
      return res.send(users);
    })
    .catch((err) => {
      return res.status(401).json({ msg: err.message });
    });
});

// @route GET /api/users/:id
// @desc Fetches username
// @access Public

router.get("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user
        ? res.send({ username: user.username })
        : res.status(400).json({ msg: "User does not exist" });
    })
    .catch((err) => res.status(401).json({ msg: err.message }));
});
// @route POST /api/users
// @desc Register new user
// @access Public
router.post("/", registerCheck, (req, res) => {
  const { name, email, password, username } = req.body;
  User.findOne({
    $or: [{ username }, { email }],
  })
    .then((user) => {
      if (user) {
        return res.status(400).json({ msg: `Credentials already in use.` });
      }
      const newUser = new User({
        name,
        email,
        password,
        username,
      });
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          newUser.save().then((user) => {
            const link =
              req.protocol +
              "://" +
              req.hostname +
              ":3000/verify/" +
              user.username +
              "/" +
              user._id;
            sendVerificationLink(user, link);
            authUser(user, (authData) => {
              res.json({
                ...authData,
              });
            });
          });
        });
      });
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

// @route GET api/users/verify/:username/:id
// @desc Verify email link resolve
// @access Public
router.get("/verify/:username/:id", (req, res) => {
  const { username, id } = req.params;
  console.log(username, id);
  User.findById(id).then((user) => {
    if (!user) return res.status(400).json({ msg: `User not found.` });
    user.verified = true;
    user.save();
  });
});
// @route POST /api/users/follow
// @desc Follow Users
// @access Public

router.post("/follow", (req, res) => {
  const { followId, userId } = req.body;
  User.findByIdAndUpdate(userId, {
    $addToSet: {
      following: followId,
    },
  })
    .then((user) => {
      if (!user) throw USER_NOT_FOUND;
      User.findByIdAndUpdate(followId, {
        $addToSet: {
          followers: userId,
        },
      })
        .then((following) => {
          if (!following) throw USER_NOT_FOUND;
          return res.json({
            user: user.username,
            following: following.username,
          });
        })
        .catch((err) => {
          res.status(400).json({ msg: err });
        });
    })
    .catch((err) => res.status(400).json({ msg: err }));
});

// @route POST /api/users/follow
// @desc Follow User
// @access Public

router.post("/unfollow", (req, res) => {
  const { followId, userId } = req.body;
  User.findByIdAndUpdate(userId, {
    $pull: {
      following: followId,
    },
  })
    .then((user) => {
      if (!user) throw USER_NOT_FOUND;
      User.findByIdAndUpdate(followId, {
        $pull: {
          followers: userId,
        },
      })
        .then((following) => {
          if (!following) throw USER_NOT_FOUND;
          return res.json({
            user: user.username,
            unfollowing: following.username,
          });
        })
        .catch((err) => {
          res.status(400).json({ msg: err });
        });
    })
    .catch((err) => res.status(400).json({ msg: err }));
});
// @route DELETE /api/users
// @desc Delete All Users
// @access Public
router.delete("/", (req, res) => {
  User.deleteMany()
    .then((result) => res.send(`Deleted ${result.deletedCount} users`))
    .catch((err) => res.status(400).json({ msg: err.message }));
});
// @route DELETE /api/users/:id
// @desc Delete User By Id
// @access Public
router.delete("/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user
        .delete()
        .then((val) => {
          res.json({ success: true });
        })
        .catch((err) => {
          res.status(401).json({ msg: err.message });
        });
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});
module.exports = router;
