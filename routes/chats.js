const express = require("express");
const isAuth = require("../middleware/jwt");
const chatsController = require("../controllers/chats");
const { body } = require("express-validator");

const routes = express.Router();

//GET all messages
routes.get("/get-chats", isAuth, chatsController.getAllChats);

//POST new chat
routes.post(
  "/post-chat",
  isAuth,
  [body("message").not().isEmpty().withMessage("chat can not be empty").trim()],
  chatsController.postChat
);

module.exports = routes;
