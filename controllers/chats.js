const Message = require("../models/messages");
const { validationResult } = require("express-validator");

exports.getAllChats = async (req, res, next) => {
  try {
    const chats = await Message.find();
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
  const user = req.userId;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid user input");
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const chats = new Message();
    chats.message = chat;
    chats.user = user;
    await chats.save();
    res.status(201).json({message:"Chat successfully saved"})
  } catch (error) {
    if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
  }
};