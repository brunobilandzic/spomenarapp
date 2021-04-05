const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  dictionary: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["multiple_choice", "acceptance", "open"],
  },
  choices: {
    type: Array,
    required: false,
  },
  order: {
    type: Number,
    required: true,
  },
});

module.exports = Question = mongoose.model("question", QuestionSchema);
