const User = require("../../models/usersSchema");
const FacebookStrategy = require("passport-facebook").Strategy;

function configureFacebookStrategy(passport) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_APP_ID,
        clientSecret: process.env.FB_APP_SECRET,
        callbackURL: process.env.FB_REDIRECT_URI,
        profileFields: ["email", "name"],
      },

      function (req, accessToken, refreshToken, profile, done) {
        process.nextTick(async function () {
          try {
            const localuser = await User.findOne({
              email: profile._json.email,
            });
            if (localuser) {
              console.log("User found");
              done(null, localuser);
            } else {
              let new_user = {
                facebook_id: profile.id,
                name: profile._json.first_name + profile._json.last_name,
                email: profile._json.email,
              };
              const newUser = await new User(new_user).save();
              done(null, newUser);
            }
          } catch (error) {
            console.log(error);
          }
        });
      }
    )
  );
}

module.exports = {
  configureFacebookStrategy,
};
