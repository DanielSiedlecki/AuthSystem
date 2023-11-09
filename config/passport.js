const passport = require("passport");
const User = require("../models/usersSchema");
const {
  configureFacebookStrategy,
} = require("../controllers/authProviders/facebookAuth.controller");
const {
  configureGoogleStrategy,
} = require("../controllers/authProviders/googleAuth.controller");

module.exports = () => {
  passport.use(User.createStrategy());

  configureFacebookStrategy(passport);
  configureGoogleStrategy(passport);
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
};
