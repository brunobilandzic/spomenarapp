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
  access: {
    type: Object,
    default: {
      isPrivate: false,
      accessedBy: [],
    },
  },
}, {
  toJSON: {
    transform(_doc, data) {
      // Older documents can still contain these fields.
      delete data.imageUrl;
      delete data.imageId;
      return data;
    },
  },
});

module.exports = Dictionary = mongoose.model("dictionary", DictionarySchema);
