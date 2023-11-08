const User = require("../../models/usersSchema");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

function configureGoogleStrategy(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_REDIRECT_URI,
      },
      function (accessToken, refreshToken, profile, cb) {
        return db(err, user);
      }
    )
  );
}
