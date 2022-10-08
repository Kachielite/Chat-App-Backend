const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user");
const isAuth = require("../middleware/jwt");

const routes = express.Router();

routes.put("/update-user-data", isAuth, userController.updateUserData);

routes.get("/users", isAuth, userController.getAllUsers);

routes.get("/user/:userId", isAuth, userController.updateUserDetails);

module.exports = routes;
