const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/user");
const isAuth = require("../middleware/jwt");

const routes = express.Router();

routes.put(
  "/update-user-data",
  isAuth,
  [
    body("name").not().isEmpty().withMessage("name is required"),
    body("password")
      .not()
      .isEmpty()
      .withMessage("password is required")
      .isLength({ min: 5 })
      .withMessage("Password must have a minimum of 5 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match, please check and try again");
      }
      return true;
    }),
  ],
  userController.updateUserData
);

routes.get('/users', isAuth, userController.getAllUsers)

module.exports = routes;
