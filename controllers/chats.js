const Message = require("../models/messages");
const User = require("../models/user");
const { validationResult } = require("express-validator");

exports.getAllChats = async (req, res, next) => {
  try {
    const chats = await Message.find().populate("user");
    res
      .status(200)
      .json({ message: "Chats successfully fetched", chats: chats });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};




exports.postChat = async (req, res, next) => {
  const chat = req.body.message;
  const userId = req.userId;
  const io = req.app.get("socketio");

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid user input");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }
    const userDetails = await User.findById(userId)
    const chats = new Message();
    chats.message = chat;
    chats.user = userId;
    await chats.save();
  io.emit("new chat", {_id: chats._id, message: chat, user: {_id: userDetails._id, username: userDetails.name}});
    res.status(201).json({ message: "Chat successfully saved" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
