const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const bodyParser = require("body-parser");
const passport = require("passport");
var jsonParser = bodyParser.json();

router.post("/register", jsonParser, authController.createUser);
router.post(
  "/login",
  jsonParser,
  passport.authenticate("local", { session: false }),
  authController.loginUser
);

module.exports = router;
