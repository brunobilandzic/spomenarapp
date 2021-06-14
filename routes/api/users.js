const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const base64url = require("base64url");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");

const User = require("../../models/User");
const Answer = require("../../models/Answer");
const registerCheck = require("../../middleware/register");
const sendVerificationLink = require("../../email/verification");
const authUser = require("../../jwt");
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const { USER_NOT_FOUND } = require("../../config/errors");
const Dictionary = require("../../models/Dictionary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "spomenar",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});

// @route GET /api/users
// @desc Fetches all users in DB
// @access Public
router.get("/", auth, (req, res) => {
  User.find({
    _id: {
      $ne: req.user.id,
    },
  })
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
router.post("/", (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(400).json({ msg: "Form parse error" });
    const registerError = registerCheck(fields);
    if (registerError) return res.status(400).json({ msg: registerError });
    const { email, password, username } = fields;

    User.findOne({
      $or: [{ username }, { email }],
    }).then((user) => {
      if (user) {
        return res.status(400).json({ msg: `Credentials already in use.` });
      }
      const newUser = new User({
        email,
        password,
        username,
      });
      bcrypt.genSalt(10, (err, salt) => {
        if (err) throw err;
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          newUser.password = hash;
          if (files.image) {
            cloudinary.uploader.upload(
              files.image.path,
              (err, uploadResult) => {
                if (err) throw new Error("Image upload error");
                newUser.imageUrl = uploadResult.secure_url;
                newUser.imageId = uploadResult.public_id;
                newUser.save().then((user) => {
                  hashAndSendVerificationLink(user, req, res);
                });
              }
            );
          } else {
            newUser.save().then((user) => {
              hashAndSendVerificationLink(user, req, res);
            });
          }
        });
      });
    });
  });
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
            imageUrl: u.imageUrl,
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

// @route PATCH /api/users/profileimage
// @desc Change user profile image
// @access Private

router.patch("/profileimage", auth, (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      const form = new formidable();
      form.parse(req, (err, fields, files) => {
        cloudinary.uploader.upload(files.newImage.path, (err, uploadResult) => {
          if (err) return res.status(400).json({ msg: err.message });
          const toDeleteId = user.imageId;
          user.imageUrl = uploadResult.secure_url;
          user.imageId = uploadResult.public_id;
          cloudinary.uploader.destroy(toDeleteId, (err, destroyResult) => {
            user.save().then((userData) => {
              authUser(userData, (authData) => {
                res.json({ ...authData });
              });
            });
          });
        });
      });
    })
    .catch((err) => res.status(400).json({ msg: err.messge }));
});

// @route DELETE /api/users/profileimage
// @desc Change user profile image
// @access Private

router.delete("/profileimage", auth, (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      const toDeleteId = user.imageId;
      user.imageUrl = null;
      user.imageId = null;
      cloudinary.uploader.destroy(toDeleteId, (err, destroyResult) => {
        if (err) return res.status(400).json({ msg: err.message });
        user.save().then((userData) => {
          authUser(userData, (authData) => {
            res.json({ ...authData });
          });
        });
      });
    })
    .catch((err) => res.status(400).json({ msg: err.messge }));
});
// @route GET /api/users/images/question/:questionId
// @desc Get username - imageUrl key value pairs for a question answerers
// @access Public
router.get("/images/question/:questionId", (req, res) => {
  Answer.find({
    question: req.params.questionId,
  })
    .then((answers) => {
      User.find({
        username: {
          $in: [...answers.map((a) => a.author_username)],
        },
      }).then((users) => {
        let toSend = {};
        if (!users) throw new Error("No users found");
        users.forEach((u) => (toSend[u.username] = u.imageUrl));
        res.json({
          usernameImages: { ...toSend },
        });
      });
    })
    .catch((err) => res.status(400).json({ msg: err.messge }));
});

// @route GET /api/users/images/dictionary
// @desc Get username - imageUrl key value pairs for a dictionar authors
// @access Public
router.post("/images/dictionary/", (req, res) => {
  User.find({
    _id: {
      $in: [...req.body.authorIds],
    },
  })
    .then((users) => {
      let toSend = {};
      if (!users) throw new Error("No users found");
      users.forEach((u) => (toSend[u.username] = u.imageUrl));
      res.json({
        usernameImages: { ...toSend },
      });
    })
    .catch((err) => res.status(400).json({ msg: err.messge }));
});

// @route DELETE /api/users
// @desc Delete All Users
// @access Public
router.delete("/", (req, res) => {
  User.deleteMany()
    .then((result) => res.send(`Deleted ${result.deletedCount} users`))
    .catch((err) => res.status(400).json({ msg: err.message }));
});
// @route DELETE /api/users/self
// @desc Delete User By Id
// @access Public

// It is pretty nested because

router.delete("/self", auth, (req, res) => {
  const user = req.user.id;
  console.log(user);
  User.findById(user)
    .then((doc) => {
      return doc.delete();
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

router.get("/resendverify/:id", (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) return;
      else return hashAndSendVerificationLink(user, req, res);
    })
    .catch((err) => res.status(401).json({ msg: err.message }));
});

function hashAndSendVerificationLink(user, req, res) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) throw err;
    bcrypt.hash(String(user._id), salt, (err, hash) => {
      if (err) throw err;
      const link =
        req.protocol +
        "://" +
        req.hostname +
        ":3000/verify/" +
        user.username +
        "/" +
        base64url(hash);
      sendVerificationLink(user, link);
      res.json({
        username: user.username,
        id: user._id,
        verified: user.verified,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
      });
    });
  });
}
module.exports = router;
