const Dictionary = require("../../models/Dictionary");
const User = require("../../models/User");
const Image = require("../../models/Image");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { USER_NOT_FOUND } = require("../../config/errors");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  folder: "spomenar",
  allowedFormats: ["jpg", "png"],
  transformation: [{ width: 500, height: 500, crop: "limit" }],
});

// @route GET /api/dicts
// @desc Fetches all dictionaries in DB
// @access Public

router.get("/", (req, res) => {
  Dictionary.find()
    .sort({ date: -1 })
    .then((dicts) => {
      return res.send(dicts);
    })
    .catch((err) => {
      return res.status(500).json({ msg: err.message });
    });
});

// @route GET /api/dicts/:id
// @desc Fetches dictionary by id
// @access Public

router.get("/:id", (req, res) => {
  Dictionary.findById(req.params.id)
    .then((dict) => {
      if (!dict) res.status(404).json({ msg: "Not found" });
      return res.send(dict);
    })
    .catch((err) => res.status(500).json({ msg: err.message }));
});

// @route GET /api/dicts/u/:author
// @desc Fetches dictionaries by author
// @access Public

router.get("/u/:author", (req, res) => {
  const author = req.params.author;
  Dictionary.find({ author })
    .then((dicts) => {
      if (!dicts) throw new Error("User does not have dictionaries yet");
      return res.send(dicts);
    })
    .catch((err) => {
      res.status(400).json({ msg: err.message });
    });
});

// @route POST /api/dicts
// @desc Create a new dictionary
// @access Private

router.post("/", auth, (req, res) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields, files) => {
    const { author, title, description } = fields;
    if (err) res.status(400).json({ msg: "Form parse error" });
    User.findById(author)
      .then((user) => {
        if (!user) throw new Error(USER_NOT_FOUND);
        const newDict = new Dictionary({
          author: user._id,
          author_username: user.username,
          title,
          description,
        });
        if (files.image) {
          const imageUploadUrl = files.image.path;
          console.log(files.image, imageUploadUrl);
          cloudinary.uploader.upload(imageUploadUrl, (err, uploadResult) => {
            if (err) throw new Error("Image upload error");
            newDict.imageUrl = uploadResult.secure_url;
            newDict.imageId = uploadResult.public_id;
            return newDict
              .save()
              .then((dict) => res.send(dict))
              .catch((err) => res.status(400).json({ msg: err.message }));
          });
        } else {
          return newDict
            .save()
            .then((dict) => res.send(dict))
            .catch((err) => res.status(400).json({ msg: err.message }));
        }
      })
      .catch((err) => {
        res.status(400).json({ msg: err.message });
      });
  });
});

// @route DELETE /api/dicts
// @desc Delete All Dictionaries
// @access Public
router.delete("/", (req, res) => {
  Dictionary.deleteMany()
    .then((result) => res.send(`Deleted ${result.deletedCount} dictionaries.`))
    .catch((err) => res.status(400).json({ msg: err.message }));
});
// @route DELETE /api/dicts/:id
// @desc Delete Dictionary By Id
// @access Public
router.delete("/:id", auth, (req, res) => {
  Dictionary.findById(req.params.id)
    .then((dict) => {
      return dict.delete();
    })
    .then((dict) => res.json({ dictId: dict.id }))
    .catch((err) => res.status(400).json({ msg: err.message }));
});
module.exports = router;
