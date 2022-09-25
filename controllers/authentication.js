const bcyrpt = require("bcryptjs");
const { validationResult } = require("express-validator");
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
    return res.status(201).json({message:"User successfully created", userId: newUser._id})
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
