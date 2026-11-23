const Dictionary = require("../../models/Dictionary");
const User = require("../../models/User");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
const { USER_NOT_FOUND } = require("../../config/errors");

// @route GET /api/dicts
// @desc Fetches all dictionaries sorted by date newest
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

router.post("/", auth, async (req, res) => {
  if (!req.is("application/json")) {
    return res.status(415).json({ msg: "Expected a JSON request." });
  }
  const { author, title, description } = req.body;
  if (
    typeof author !== "string" ||
    typeof title !== "string" ||
    (description !== undefined && typeof description !== "string")
  ) {
    return res.status(400).json({ msg: "Invalid dictionary fields." });
  }
  try {
    const user = await User.findById(author);
    if (!user) throw new Error(USER_NOT_FOUND);
    const dictionary = await Dictionary.create({
      author: user._id,
      author_username: user.username,
      title,
      description,
    });
    return res.json(dictionary);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});

// @route DELETE /api/dicts
// @desc Delete All Dictionaries
// @access Admin
router.delete("/", admin, (req, res) => {
  Dictionary.deleteMany()
    .then((result) => res.json({ deletedCount: result.deletedCount }))
    .catch((err) => res.status(400).json({ msg: err.message }));
});
// @route DELETE /api/dicts/:id
// @desc Delete Dictionary By Id
// @access Public
router.delete("/:id", auth, (req, res) => {
  Dictionary.findById(req.params.id)
    .then(async (dict) => {
      if (req.user.id != dict.author)
        return res.status(400).json({ msg: "Client not dict owner." });
      await dict.deleteOne();
      return res.json({ dictId: dict.id });
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});
module.exports = router;
