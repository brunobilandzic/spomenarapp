require("dotenv").config();

const appUrl = new URL(
  process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || "http://localhost:3000"
);
if (appUrl.protocol !== "http:" && appUrl.protocol !== "https:") {
  throw new Error("APP_URL must use HTTP or HTTPS.");
}

module.exports = {
  APP_URL: appUrl.origin,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  EMAIL_FROM: process.env.EMAIL_FROM,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  ADMIN_KEY: process.env.ADMIN_KEY,
};
