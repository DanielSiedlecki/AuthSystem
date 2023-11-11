const User = require("../models/usersSchema");
const Token = require("../models/tokenSchema");
const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../mailer/email");
const passport = require("passport");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
  try {
    const secret = await speakeasy.generateSecret();

    const { name, email, password } = req.body;
    const user = new User({ name, email, secretKey: secret.base32 });
    await User.register(user, password);

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const data_url = await QRCode.toDataURL(secret.otpauth_url);

    const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
    await sendEmail(user.email, "Verify Email", "confirmAccount", message);

    const htmlResponse = `<html><body><img src="${data_url}"> User created</body></html>`;
    res.status(201).send(htmlResponse);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
    console.log(error);
  }
};

const ForgotPasswordRequest = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    if (user) {
      const message = `${process.env.BASE_URL}/user/changepassword/${user.id}/${token.token}`;

      await sendEmail(user.email, "Change Password", "forgotPassword", message);

      res.status(200).json({ message: "Email sended" });
    } else {
      res.status(400).json({ message: "Email is not registered", token });
    }
  } catch (error) {
    console.log(error);
  }
};

const changeForgotPassword = async (req, res) => {
  try {
    if (req.params.id.length != 24) return res.status(400).send("Invalid link");
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) return res.status(400).send("Invalid link");
    const token = await Token.findOne({
      userId: req.params.id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    user.setPassword(req.body.newPassword, async () => {
      await user.save();
    });
    await Token.findByIdAndRemove(token._id);
    res.send("Password changed");
  } catch (error) {
    console.log(error);
  }
};

const verifyUser = async (req, res) => {
  try {
    if (req.params.id.length != 24) return res.status(400).send("Invalid link");

    const user = await User.findOne({
      _id: req.params.id,
    });

    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: req.params.id,
      token: req.params.token,
    });

    if (!token) return res.status(400).send("Invalid link");

    await User.findOneAndUpdate({ _id: user._id }, { verified_status: true });
    await Token.findByIdAndRemove(token._id);
    res.send("Email verified sucessfully");
  } catch (error) {
    res.status(400).send("Error");
  }
};

const loginUser = async (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.redirect(console.log("error"));
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.status(400).send({ err });
      }
      if (!user) {
        res.status(201).json({ message: "Error" });
      }

      const userSecretKey = user.user.secretKey;
      const secretKey = req.body.secretKey;

      const verified = speakeasy.totp.verify({
        secret: userSecretKey,
        encoding: "base32",
        token: secretKey,
      });

      if (!verified) {
        return res.status(401).send("Invalid secretKey");
      }

      var payload = {
        id: user._id,
      };
      const token = jsonwebtoken.sign(payload, process.env.JWT_KEY, {
        expiresIn: 3600,
      });

      res.status(201).json({ message: "Login succes", token });
    });
  })(req, res, next);
};

const loginFacebook = function (req, res, next) {
  passport.authenticate("facebook", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.redirect(console.log("error"));
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.status(400).send({ err });
      }
      if (!user) {
        res.status(201).json({ message: "Error" });
      }
      var payload = {
        id: user._id,
      };
      const token = jsonwebtoken.sign(payload, process.env.JWT_KEY, {
        expiresIn: 3600,
      });

      res.status(201).json({ message: "Login succes", token });
    });
  })(req, res, next);
};

const loginGmail = function (req, res, next) {
  passport.authenticate(
    "google",
    { scope: ["email", "profile"] },
    (err, profile) => {
      if (err) {
        console.log(err);
      }

      if (!profile) {
        res.status(201).json({ message: "Error" });
      }

      var payload = {
        id: profile._id,
      };

      const token = jsonwebtoken.sign(payload, process.env.JWT_KEY, {
        expiresIn: 3600,
      });

      res.status(201).json({ message: "Login succes", token });
    }
  )(req, res, next);
};
module.exports = {
  createUser,
  verifyUser,
  loginUser,
  loginFacebook,
  loginGmail,
  ForgotPasswordRequest,
  changeForgotPassword,
};
