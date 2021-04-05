const Dictionary = require("../../models/Dictionary");
const User = require("../../models/User");
const express = require("express");
const router = express.Router();
const { USER_NOT_FOUND } = require("../../config/errors");
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

router.post("/", (req, res) => {
  console.log(req.body);
  const { author, title, description } = req.body;
  User.findOne({ username: author })
    .then((user) => {
      if (!user) throw { message: USER_NOT_FOUND };
      const newDict = new Dictionary({
        author: user._id,
        title,
        description,
      });
      newDict
        .save()
        .then((dict) => {
          console.log(dict);
          res.send(dict);
        })
        .catch((err) => res.status(400).json({ msg: err.message }));
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
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
router.delete("/:id", (req, res) => {
  Dictionary.findById(req.params.id)
    .then((dict) => {
      dict
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
