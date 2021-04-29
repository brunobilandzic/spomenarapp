const Dictionary = require("../../models/Dictionary");
const Answer = require("../../models/Answer");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
// @route GET /api/answers
// @desc Fetches all answers in the App
// @access Public
router.get("/", (req, res) => {
  Answer.find()
    .then((answers) => {
      return res.send(answers);
    })
    .catch((err) => {
      return res.status(400).json({ msg: err.message });
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

// @route POST /api/answers/check/:question
// @desc Check if user has answered the dictionary
// @access Private
router.get("/check/:question", auth, (req, res) => {
  const author = req.user.id;
  const { question } = req.params;
  Answer.findOne({
    $and: [{ question }, { author }],
  })
    .then((answer) => {
      if (answer) return res.json({ answer: true });
      else return res.json({ answer: false });
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});

// @route POST /api/answers/count/:question
// @desc Get answer count for dictionary
// @access Private
router.get("/count/:question", (req, res) => {
  const { question } = req.params;
  Answer.countDocuments({ question })
    .then((count) => res.json({ count }))
    .catch((err) => res.status(400).json({ msg: err.message }));
});
router.delete("/", (req, res) => {
  Answer.deleteMany({})
    .then((res) => null)
    .catch((err) => console.log(err));
});
module.exports = router;
