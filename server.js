const express = require("express");
const { existsSync } = require("node:fs");
const path = require("node:path");
const config = require("./config");
const mongoose = require("mongoose");
const { MONGO_URI } = config;

if (MONGO_URI) {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("MongoDB connected...");
    })
    .catch((err) => {
      console.error(
        `MongoDB connection failed (${err.name}). Check MONGO_URI and database access.`
      );
    });
} else {
  console.warn(
    "MONGO_URI is missing. Database-backed routes require a MongoDB connection."
  );
}

const app = express();
app.use(express.json());

app.use("/api/dicts", require("./routes/api/dicts"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/quests", require("./routes/api/quest"));
app.use("/api/answers", require("./routes/api/answers"));
app.use("/api", (_req, res) => {
  res.status(404).json({ msg: "API route not found." });
});

const clientBuild = path.join(__dirname, "client", "build");
const clientIndex = path.join(clientBuild, "index.html");
if (existsSync(clientIndex)) {
  app.use(express.static(clientBuild));
  app.get("*", (req, res, next) => {
    if (
      req.path.startsWith("/assets/") ||
      path.extname(req.path) ||
      !req.accepts("html")
    ) {
      return next();
    }
    res.sendFile(clientIndex);
  });
}

const PORT = Number(process.env.PORT || 5000);

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on ${server.address().port}`);
});
