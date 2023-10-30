const express = require("express");
const serverConfig = require("./config/config.js");
const cors = require("cors");
const app = express();
const connectDB = require("./config/dbConnection");
const authRoutes = require("./routes/authRoutes");
const PORT = process.env.PORT || serverConfig.port;
const passport = require("./config/passport.js");
require("dotenv").config();

app.use(
  cors({
    origin: serverConfig.cors,
    methods: serverConfig.methods,
  })
);

app.use("/auth", authRoutes);

connectDB();
passport();

app.listen(PORT, () => {
  console.log("Server running");
});
