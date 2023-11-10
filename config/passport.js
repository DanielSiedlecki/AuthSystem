const passport = require("passport");
const User = require("../models/usersSchema");
const {
  configureFacebookStrategy,
} = require("../controllers/authProviders/facebookAuth.controller");
const {
  configureGoogleStrategy,
} = require("../controllers/authProviders/googleAuth.controller");
const {
  configureLocalStrategy,
} = require("../controllers/authProviders/localAuth.controller");
module.exports = () => {
  passport.use(User.createStrategy());
  configureLocalStrategy(passport);
  configureFacebookStrategy(passport);
  configureGoogleStrategy(passport);
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
};
