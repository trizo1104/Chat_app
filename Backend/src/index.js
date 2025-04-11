const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const cookieParse = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const authRoute = require("./routes/auth.route");
const messageRoute = require("./routes/message.route");
const connectDB = require("./lib/db");
const { app, server } = require("./lib/socket");

//handle increase limit for upload image
app.use(bodyParser.json({ limit: "2mb" }));
app.use(bodyParser.urlencoded({ limit: "2mb", extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParse());
const port = process.env.PORT || 5001;
const __dirname = path.resolve();

connectDB();

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(port, () => {
  console.log(`server is listen on port ${port}`);
});
