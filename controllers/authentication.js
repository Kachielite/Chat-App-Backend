const bcyrpt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.register = async (req, res, next) => {
  const name = req.body.name;
  const username = req.body.username;
  const password = req.body.password;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let error = new Error("Invalid User Input");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const harshPassword = await bcyrpt.hash(password, 12);
    const user = new User();
    user.name = name;
    user.username = username;
    user.password = harshPassword;
    const newUser = await user.save();
    return res.status(201).json({
      message: "User successfully created",
      userId: newUser._id.toString(),
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const io = req.app.get("socketio");
  // const socketId = req.app.get("socketId");

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid User Input");
      error.statusCode = 422;
      throw error;
    }

    const user = await User.findOne({ username: username });
    if (!user) {
      let error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    const verifyPassword = await bcyrpt.compare(password, user.password);
    if (!verifyPassword) {
      const error = new Error("Authentication failed. Wrong Password");
      error.statusCode = 401;
      throw error;
    }
    let userDetails = {
      userId: user._id.toString(),
      username: user.username,
      profile_photo: !user.display_picture_url ? "" : user.display_picture_url,
    };
    const token = jwt.sign(userDetails, "chatappsupersecretpasswordtoken", {
      expiresIn: "1h",
    });
    req.username = user.username;

    return res.status(200).json({
      message: "User successfully signed in.",
      user: userDetails,
      token: token,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
