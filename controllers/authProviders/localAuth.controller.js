const User = require("../../models/usersSchema");
const LocalStrategy = require("passport-local").Strategy;

function configureLocalStrategy(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async function (username, password, done) {
        try {
          const localuser = await User.authenticate()(username, password);

          if (!localuser) {
            return done(null, false);
          }

          console.log("User Found");
          return done(null, localuser);
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );
}

module.exports = { configureLocalStrategy };
