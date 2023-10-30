const mongoose = require("mongoose");

const url = require("./db.config");

function connectDB() {
  mongoose
    .connect(url.database.host, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
    });
}

module.exports = connectDB;
