const User = require("../models/usersSchema");
const jsonwebtoken = require("jsonwebtoken");


const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email });
    await User.register(user, password);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while creating the user" });
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
  loginUser,
};
