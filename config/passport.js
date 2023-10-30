const passport = require("passport");
const User = require("../models/usersSchema");

module.exports = () => {
  passport.use(User.createStrategy());
};
