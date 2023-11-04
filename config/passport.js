const passport = require("passport");
const User = require("../models/usersSchema");
const FacebookStrategy = require("passport-facebook").Strategy;

module.exports = () => {
  passport.use(User.createStrategy());
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.APP_SECRET,
        callbackURL: process.env.REDIRECT_URI,
        profileFields: ["email", "name"],
      },
      function (accessToken, refreshToken, profile, done) {
        const userData = {
          facebook_id: profile.id,
          name: profile.name.givenName,
          email: profile.email || "email-not-provided",
        };

        new User(userData).save();
        console.log(profile._json);
        done(null, profile);
      }
    )
  );
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
};
