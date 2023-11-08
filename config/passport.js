const passport = require("passport");
const User = require("../models/usersSchema");
const {
  configureFacebookStrategy,
} = require("../controllers/authProviders/facebookAuth.controller");

module.exports = () => {
  passport.use(User.createStrategy());

  configureFacebookStrategy(passport);
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
};
