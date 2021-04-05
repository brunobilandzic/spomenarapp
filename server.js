const express = require("express");
const config = require("./config");
const mongoose = require("mongoose");

const { MONGO_URI, JWT_SECRET } = config;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(express.json());
app.get("/test", (req, res) => {
  return res.send(req.get("host"));
});
app.use("/api/dicts", require("./routes/api/dicts"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/quests", require("./routes/api/quest"));
app.use("/api/answers", require("./routes/api/answers"));
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
