const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DictionarySchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  author_username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  imageId: {
    type: String,
    default: null,
  },
  access: {
    type: Object,
    default: {
      isPrivate: false,
      accessedBy: [],
    },
  },
});

module.exports = Dictionary = mongoose.model("dictionary", DictionarySchema);
