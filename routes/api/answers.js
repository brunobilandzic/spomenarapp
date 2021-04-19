const Dictionary = require("../../models/Dictionary");
const Question = require("../../models/Question");
const Answer = require("../../models/Answer");
const User = require("../../models/User");
const express = require("express");
const router = express.Router();

// @route GET /api/answers
// @desc Fetches all answers in the App
// @access Public
router.get("/", (req, res) => {
  Answer.find()
    .then((answers) => {
      return res.send(answers);
    })
    .catch((err) => {
      return res.status(500).json({ msg: err.message });
    });
});

// @route GET /api/answers/quest/:questId
// @desc Fetches all answers for question
// @access Public
router.get("/quest/:questId", (req, res) => {
  Answer.find({ question: req.params.questId })
    .then((answers) => {
      return res.send(answers);
    })
    .catch((err) => {
      return res.status(500).json({ msg: err.message });
    });
});
// @route POST /api/answers/dict/:dictId
// @desc Adds an array of answers to dictionary
// @access Public
router.post("/dict/:dictId", (req, res) => {
  const { dictionary, answers, author, author_username } = req.body;
  Dictionary.findById(dictionary)
    .then((dict) => {
      if (!dict)
        res
          .status(404)
          .json({ msg: `Dictionary with id (${dictionary}) does not exist` });
      Answer.insertMany(
        answers.map((a) => ({ ...a, author, author_username })),
        (err, answers) => {
          if (err) return res.send(err);
          else res.send(answers);
        }
      );
    })
    .catch((err) => res.status(500).json({ msg: err.message }));
});

router.delete("/", (req, res) => {
  Answer.deleteMany({})
    .then((res) => null)
    .catch((err) => console.log(err));
});
module.exports = router;
