const Dictionary = require("../../models/Dictionary");
const Question = require("../../models/Question");
const express = require("express");
const router = express.Router();

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
// @access Public
router.post("/", (req, res) => {
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
            console.log(quests);
            res.send(quests);
          }
        }
      );
    })
    .catch((err) => res.status(500).json({ msg: err.message }));
});

// @route DELETE /api/quests
// @desc Delete All Questions (DEV use)
// @access Public
router.delete("/", (req, res) => {
  Question.deleteMany()
    .then((result) => res.send(`Deleted ${result.deletedCount} questions.`))
    .catch((err) => res.status(400).json({ msg: err.message }));
});
module.exports = router;
