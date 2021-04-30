const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
});

module.exports = Image = mongoose.model("image", imageSchema);
