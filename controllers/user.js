const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const validateEmail = (email) => {
  return String(email).match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validateUsername = (username) => {
  return (
    String(username).match(/^[0-9a-zA-Z]+$/) &&
    String(username).length >= 5 &&
    String(username).length <= 15
  );
};

const validatePassword = (password) => {
  return String(password).length >= 5 && String(password).length <= 15;
};

// Signup User
const signup = async (req, res) => {
  const username = req.body.username.toLowerCase().trim();
  const email = req.body.email.toLowerCase().trim();
  const password = req.body.password;

  if (!username || !password || !email) {
    return res.status(400).json({
      status: "error",
      message: "Missing username, email or password.",
    });
  }

  if (!validateEmail(email))
    return res.status(400).json({
      status: "error",
      message: "Enter a valid email address ",
    });

  if (!validateUsername(username))
    return res.status(400).json({
      status: "error",
      message:
        "Username must only contain numbers or letters and the length must be greater than 4 and less than 16",
    });

  if (!validatePassword(password))
    return res.status(400).json({
      status: "error",
      message: "Password must contain more than 5 characters and less than 16.",
    });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await User.create({
        username: username,
        email: email,
        password: hashedPassword,
      });

      res.status(201).send({
        status: "success",
        message: "User created sucessfully, please proceed to login.",
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          status: "error",
          message: "Username or email already exist.",
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Oops, something went wrong. Try again later.",
        });
      }
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "Oops, something went wrong. Try again later",
    });
  }
};

// Login User
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    return res.status(400).json({
      status: "error",
      message: "Missing email or password.",
    });
  }
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser)
      return res.status(401).json({
        status: "error",
        message: "No account exist with this email address.",
      });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect)
      return res
        .status(401)
        .json({ status: "error", message: "Incorrect Password" });

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      status: "success",
      message: "User logged in successfully.",
      data: { user: existingUser.username, token: token },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: "error",
      message: "Oops, something went wrong. Try again later",
    });
  }
};

module.exports = { signup, login };
