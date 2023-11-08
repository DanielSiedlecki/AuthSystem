const express = require("express");
const serverConfig = require("./config/config.js");
const cors = require("cors");
const app = express();
const connectDB = require("./config/dbConnection");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const PORT = process.env.PORT || serverConfig.port;
const passportConfig = require("./config/passport.js");
const passport = require("passport");
require("dotenv").config();

app.use(
  require("express-session")({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
passportConfig();
app.use(
  cors({
    origin: serverConfig.cors,
    methods: serverConfig.methods,
  })
);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

connectDB();

app.listen(PORT, () => {
  console.log("Server running");
});
