const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const bodyParser = require("body-parser");
const passport = require("passport");
var jsonParser = bodyParser.json();

router.post("/register", jsonParser, authController.createUser);

router.get("/user/verify/:id/:token", jsonParser, authController.verifyUser);

router.post(
  "/login",
  jsonParser,
  passport.authenticate("local"),
  authController.loginUser
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get("/facebook/callback", authController.loginFacebook);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get("/google/callback", authController.loginGmail);
module.exports = router;
