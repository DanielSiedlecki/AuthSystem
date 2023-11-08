const passport = require("passport");
const authController = require("../controllers/auth.controller");
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
  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });
};
