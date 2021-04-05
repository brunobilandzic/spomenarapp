require("dotenv").config();

module.exports = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  PWD_RESET_SALT: process.env.PWD_RESET_SALT,
  EMAIL: process.env.EMAIL,
  EMAIL_PASS: process.env.EMAIL_PASS,
};
