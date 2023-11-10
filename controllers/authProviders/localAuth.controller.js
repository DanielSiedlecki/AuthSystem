const User = require("../../models/usersSchema");
const LocalStrategy = require("passport-local").Strategy;

function configureLocalStrategy(passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (username, password, done) {
        process.nextTick(async function () {
          try {
            const localuser = await User.authenticate()(username, password);

            if (!localuser) {
              console.log("nie dziala");
              return done(null, false);
            }
            console.log("User Found");
            return done(null, localuser);
          } catch (err) {
            console.error(err);
            return done(err);
          }
        });
      }
    )
  );
}

module.exports = { configureLocalStrategy };
