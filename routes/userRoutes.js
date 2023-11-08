const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const userController = require("../controllers/user.controller");
var jsonParser = bodyParser.json();

router.get(
  "/userdata",
  jsonParser,
  userController.verifyToken,
  userController.getUserData
);
module.exports = router;
