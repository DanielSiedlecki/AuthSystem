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
      async function (accessToken, refreshToken, profile, cb) {
        try {
          const localuser = await User.findOne({
            email: profile.emails[0].value,
          });

          if (localuser) {
            console.log("User Found");
            cb(null, profile);
          } else {
            let new_user = {
              google_id: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
            };

            const newUser = await new User(new_user).save();
            cb(null, newUser);
          }
        } catch (error) {
          console.log(error);
        }
      }
    )
  );
}

module.exports = {
  configureGoogleStrategy,
};
