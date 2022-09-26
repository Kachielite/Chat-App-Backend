const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const authController = require("../controllers/authentication");
const isAuth = require('../middleware/jwt');

const routes = express.Router();

//POST
routes.post(
  "/register",
  [
    body("name").not().isEmpty().withMessage("name is required"),
    body("username")
      .not()
      .isEmpty()
      .withMessage("username is required")
      .custom((value, { req }) => {
        return User.findOne({ username: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Username is already taken.");
          }
        });
      }),
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
  authController.register
);

routes.post(
  "/sign-in",
  [
    body("username").not().isEmpty().withMessage("username is required"),
    body("password").not().isEmpty().withMessage("password is required"),
  ],
  authController.signIn
);



module.exports = routes;
