const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const base64url = require("base64url");
const User = require("../../models/User");
const Answer = require("../../models/Answer");
const registerCheck = require("../../middleware/register");
const sendVerificationLink = require("../../email/verification");
const authUser = require("../../jwt");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const { USER_NOT_FOUND } = require("../../config/errors");
const { APP_URL } = require("../../config");
const Dictionary = require("../../models/Dictionary");

// @route GET /api/users
// @desc Fetches all users in DB
// @access Public
router.get("/", auth, (req, res) => {
  User.find({
    _id: {
      $ne: req.user.id,
    },
  })
    .select("username")
    .then((users) => {
      return res.json({ users });
    })
    .catch((err) => {
      return res.status(401).json({ msg: err.message });
    });
});

// @route GET /api/users/u/:username
// @desc Fetches user by username
// @access Public

router.get("/u/:username", (req, res) => {
  const username = req.params.username;
  User.findOne({ username })
    .select("username")
    .then((user) => {
      user
        ? res.send(user)
        : res.status(400).json({ msg: "User does not exist" });
    })
    .catch((err) => res.status(401).json({ msg: err.message }));
});
// @route POST /api/users
// @desc Register new user
// @access Public
router.post("/", async (req, res) => {
  if (!req.is("application/json")) {
    return res.status(415).json({ msg: "Expected a JSON request." });
  }
  const registerError = registerCheck(req.body);
  if (registerError) return res.status(400).json({ msg: registerError });
  const { email, password, username } = req.body;

  try {
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({ msg: "Credentials already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      username,
    });
    return res.json(await sendAccountVerification(newUser));
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ msg: "Credentials already in use." });
    }
    return res.status(500).json({ msg: "Registration failed." });
  }
});

// @route GET api/users/verify/:username/:id
// @desc Verify email link resolve
// @access Public
router.get("/verify/:username/:id", (req, res) => {
  const { username, id } = req.params;
  User.findOne({ username }).then((user) => {
    if (!user) return res.status(400).json({ msg: `User not found.` });
    bcrypt.compare(String(user._id), base64url.decode(id), (err, isMatch) => {
      if (isMatch) {
        user.verified = true;
        user.save().then((user) => {
          let newUser = {
            ...user,
            verified: true,
          };
          authUser(newUser, (authData) => {
            res.json({ ...authData });
          });
        });
      }
    });
  });
});

// @route POST /api/users/follow
// @desc Follow Users
// @access Private

router.post("/follow", auth, (req, res) => {
  const userId = req.user.id;
  const { followId } = req.body;
  if (followId == userId) return res.status(400).send({ msg: USER_NOT_FOUND });
  User.findById(followId)
    .then((followUser) => {
      if (!followUser) throw USER_NOT_FOUND;
      User.findById(userId)
        .then((user) => {
          if (!user) throw USER_NOT_FOUND;
          followUser.followers.push(userId);
          user.following.push(followId);
          followUser.save().then((_f) => {
            user.save().then((_u) => {
              res.json({ followUsername: followUser.username });
            });
          });
        })
        .catch((err) => res.status(400).json({ msg: err }));
    })
    .catch((err) => res.status(400).json({ msg: err }));
});

// @route POST /api/users/unfollow
// @desc Unollow User
// @access Private

router.post("/unfollow", auth, (req, res) => {
  const userId = req.user.id;
  const { followId } = req.body;
  User.findById(followId)
    .then((followUser) => {
      if (!followUser) throw USER_NOT_FOUND;
      User.findById(userId)
        .then((user) => {
          if (!user) throw USER_NOT_FOUND;
          followUser.followers.pull(userId);
          user.following.pull(followId);
          followUser.save().then((_f) => {
            user.save().then((_u) => {
              res.send({ followUsername: followUser.username });
            });
          });
        })
        .catch((err) => res.status(400).json({ msg: err }));
    })
    .catch((err) => res.status(400).json({ msg: err }));
});
// @route GET /api/users/f/:diection/:username
// @desc Get who is user following/followers
// @access Public
router.get("/f/:direction/:username", (req, res) => {
  const { username, direction } = req.params;
  User.findOne({ username })
    .then((user) => {
      if (!user) throw USER_NOT_FOUND;
      User.find({
        _id: {
          $in: user[direction],
        },
      }).then((users) => {
        res.json({
          users: users.map((u) => ({
            username: u.username,
            id: u._id,
          })),
        });
      });
    })
    .catch((err) => res.status(400).json({ msg: err }));
});

// @route GET /api/users/bool/follow/:followId
// @desc Check if user follow other guy
// @access Private
router.get("/bool/follow/:followId", auth, (req, res) => {
  const { followId } = req.params;
  const userId = req.user.id;
  if (userId == followId) return res.json({ answer: "SAME" });
  User.findById(userId).then((user) => {
    user.following.includes(followId)
      ? res.json({ answer: "FOLLOWS" })
      : res.json({ answer: "FOLLOWS_NOT" });
  });
});

// @route DELETE /api/users
// @desc Delete All Users
// @access Admin
router.delete("/", admin, (req, res) => {
  User.deleteMany()
    .then((result) => res.send(`Deleted ${result.deletedCount} users`))
    .catch((err) => res.status(400).json({ msg: err.message }));
});
// @route DELETE /api/users/self
// @desc Delete User By Id
// @access Private

// It is pretty nested because

router.delete("/self", auth, (req, res) => {
  const user = req.user.id;
  console.log(user);
  User.findById(user)
    .then((doc) => {
      return doc.deleteOne();
    })
    .then((_) => {
      return Dictionary.deleteMany({ author: user });
    })
    .then((_) => {
      console.log(_.deletedCount);
      return Answer.deleteMany({ author: user });
    })
    .then((_) => {
      console.log(_.deletedCount);
      return res.json({ success: true });
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
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
    .catch((err) => res.status(400).json({ msg: err.message }));
});

// @route GET /api/users/email/:id
// @desc Fetches email
// @access Public

router.get("/email/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      user
        ? res.send({ email: user.email })
        : res.status(400).json({ msg: "User does not exist" });
    })
    .catch((err) => res.status(401).json({ msg: err.message }));
});

// @route GET /api/users/resendverify/:id
// @desc Resend verification link
// @access Public

router.get("/resendverify/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: "User does not exist." });
    const result = await sendAccountVerification(user);
    if (!result.verificationEmailSent) {
      return res.status(502).json({ msg: "Could not send the verification email. Please try again." });
    }
    return res.json(result);
  } catch {
    return res.status(500).json({ msg: "Could not resend the verification email." });
  }
});

async function sendAccountVerification(user) {
  let verificationEmailSent = false;
  try {
    const hash = await bcrypt.hash(String(user._id), 10);
    const link = `${APP_URL}/verify/${encodeURIComponent(user.username)}/${base64url(hash)}`;
    await sendVerificationLink(user, link);
    verificationEmailSent = true;
  } catch (error) {
    console.error("Verification email failed:", error.message);
  }
  return {
    username: user.username,
    id: user._id,
    verified: user.verified,
    name: user.name,
    email: user.email,
    verificationEmailSent,
  };
}
module.exports = router;
