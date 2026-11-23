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
  following: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  followers: {
    type: [Schema.Types.ObjectId],
    default: [],
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

module.exports = User = mongoose.model("user", UserSchema);
