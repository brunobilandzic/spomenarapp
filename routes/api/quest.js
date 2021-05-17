const Dictionary = require("../../models/Dictionary");
const Question = require("../../models/Question");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");
// @route GET /api/quests/dict/:dictId
// @desc Fetches all questions for dictionary
// @access Public

router.get("/dict/:dictId", (req, res) => {
  Question.find({ dictionary: req.params.dictId })
    .sort({ order: 1 })
    .then((quests) => {
      return res.send(quests);
    })
    .catch((err) => {
      return res.status(500).json({ msg: err.message });
    });
});
// @route POST /api/quests/
// @desc Adds an array of questions to dictionary
// @access Private
router.post("/", auth, (req, res) => {
  const { dictionary, questions } = req.body;
  Dictionary.findById(dictionary)
    .then((dict) => {
      if (!dict)
        return res
          .status(404)
          .json({ msg: `Dictionary with id (${dictionary}) does not exist` });
      Question.insertMany(
        questions.map((q) => ({ ...q, dictionary })),
        (err, quests) => {
          if (err) res.send(err);
          else {
            res.send(quests);
          }
        }
      );
    })
    .catch((err) => res.status(500).json({ msg: err.message }));
});

// @route DELETE /api/quests
// @desc Delete All Questions (DEV use)
// @access Admin
router.delete("/", admin, (req, res) => {
  Question.deleteMany()
    .then((result) => res.send({ deletedCount: result.deletedCount }))
    .catch((err) => res.status(400).json({ msg: err.message }));
});
module.exports = router;
