const Dictionary = require("../../models/Dictionary");
const Answer = require("../../models/Answer");
const Question = require("../../models/Question");
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const admin = require("../../middleware/admin");

// @route GET /api/answers
// @desc Fetches all answers in the App
// @access Admin

router.get("/", admin, (req, res) => {
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
      return res.status(400).json({ msg: err.message });
    });
});

// @route GET /api/answers/dict/count/:dictionary
// @desc Fetches answer count for one dictionary
// @access Public
router.get("/dict/count/:dictionary", (req, res) => {
  const { dictionary } = req.params;
  Question.findOne({ dictionary })
    .then((question) => {
      return Answer.countDocuments({ question: question._id });
    })
    .then((count) => res.send({ count }))
    .catch((err) => res.status(400).json({ msg: err.message }));
});

// @route GET /api/answers/dict/count
// @desc Fetches answer counts for given dictionaries
// @access Public

router.post("/dict/count", (req, res) => {
  const dictionaries = req.body.dictionaries;
  const answerCounts = dictionaries.map((dictionary) => ({
    dictionary,
    count: 0,
    isWritten: false,
  }));
  Question.find({
    dictionary: {
      $in: [...dictionaries],
    },
  })
    .then((questions) => {
      if (!questions) throw new Error("No questions found.");
      const uniqueQuestions = questions.filter((q) => {
        let answerCountIndex = answerCounts
          .map((d) => d.dictionary)
          .indexOf(q.dictionary.toString());
        if (answerCounts[answerCountIndex].isWritten) return false;
        else {
          answerCounts[answerCountIndex].isWritten = true;
          return true;
        }
      });
      let uniqueQuestionIds = uniqueQuestions.map((q) => ({
        question: q._id,
        dictionary: q.dictionary,
      }));
      Answer.find({
        question: {
          $in: [...uniqueQuestionIds.map((q) => q.question)],
        },
      }).then((answers) => {
        answers.forEach((answer) => {
          let uniqueQuestionIdsIndex = uniqueQuestionIds
            .map((q) => q.question.toString())
            .indexOf(answer.question.toString());
          let dictionaryId =
            uniqueQuestionIds[uniqueQuestionIdsIndex].dictionary;
          let answerCountIndex = answerCounts
            .map((d) => d.dictionary.toString())
            .indexOf(dictionaryId.toString());
          answerCounts[answerCountIndex].count++;
        });
        return res.send(answerCounts);
      });
    })
    .catch((err) => res.status(400).json({ msg: err.message }));
});
// @route POST /api/answers/dict/:dictId
// @desc Adds an array of answers to dictionary
// @access Public
router.post("/dict/:dictId", auth, (req, res) => {
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

// @route GET /api/answers/count/:question
// @desc Get answer count for dictionary
// @access Public
router.get("/count/:question", (req, res) => {
  const { question } = req.params;
  Answer.countDocuments({ question })
    .then((count) => res.json({ count }))
    .catch((err) => res.status(400).json({ msg: err.message }));
});

// @route DELETE /api/answers
// @desc Deletes all answers
// @access Admin
router.delete("/", admin, (req, res) => {
  Answer.deleteMany({})
    .then((deleted) => {
      console.log(deleted);
      res.json({ deletedCount: deleted.deletedCount });
    })
    .catch((err) => console.log(err));
});
module.exports = router;
