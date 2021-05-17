const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 4,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  imageUrl: {
    type: String,
    default: null,
  },
  imageId: {
    type: String,
    default: null,
  },
  following: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  followers: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
});

module.exports = User = mongoose.model("user", UserSchema);
