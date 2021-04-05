const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
  question: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = Answer = mongoose.model("answer", AnswerSchema);
