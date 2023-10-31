const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    verified_status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

module.exports = mongoose.model("User", userSchema);
