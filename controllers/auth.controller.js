const User = require("../models/usersSchema");
const Token = require("../models/tokenSchema");
const jsonwebtoken = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../mailer/email");

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email });
    await User.register(user, password);

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
    await sendEmail(user.email, "Verify Email", "confirmAccount", message);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
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
    res.send("email verified sucessfully");
  } catch (error) {
    const user = await User.findOne({ _id: req.params.id });
    res.status(400).send("Error");
    console.log(user._id);
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const token = jsonwebtoken.sign({ id: req.user.id }, process.env.JWT_KEY, {
      expiresIn: 3600,
    });

    res.status(201).json({ message: "Login succes", token });
  } catch (error) {
    res.status(500);
    console.log(error);
  }
};

module.exports = {
  createUser,
  verifyUser,
  loginUser,
};
