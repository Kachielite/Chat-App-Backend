const bcyrpt = require("bcryptjs");
const dotenv = require("dotenv");
const { validationResult } = require("express-validator");
const cloudinary = require("cloudinary").v2;
const User = require("../models/user");
const deleteFiles = require("../utils/deleteImage");

dotenv.config();
//Cloudinary Config
cloudinary.config({
  cloud_name: "dahpyu601",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.updateUserData = async (req, res, next) => {
  let name = req.body.name;
  let password = req.body.password;
  let confirmPassword = req.body.confirmPassword;
  let display_picture =
    req.body.profile_photo === undefined ? null : req.body.profile_photo;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid user input");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const user = await User.findById(req.userId);

    try {
      if (display_picture && user.display_picture_url) {
        await cloudinary.uploader.destroy(user.display_picture_public_id);
        imageStorage = await cloudinary.uploader.upload(display_picture, {
          folder: "chats",
        });
        user.display_picture_url = imageStorage.secure_url;
        user.display_picture_public_id = imageStorage.public_id;
      } else if (display_picture && !user.display_picture_url) {
        imageStorage = await cloudinary.uploader.upload(display_picture, {
          folder: "chats",
        });
        user.display_picture_url = imageStorage.secure_url;
        user.display_picture_public_id = imageStorage.public_id;
      }
      console.log(imageStorage);
      if (password && password === confirmPassword) {
        user.password = await bcyrpt.hash(password, 12);
      }
      if (name) {
        user.name = name;
      }

      try {
        await user.save();
        return res
          .status(200)
          .json({ message: "User data successfully updated" });
      } catch (error) {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        next(error);
      }
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { username: 1, display_picture_url: 1 });
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    } else {
      return res.status(200).json({ users: users });
    }
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.updateUserDetails = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    res
      .status(200)
      .json({ message: "User details successfully fetched", user: user });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
