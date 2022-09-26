const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authentication");
const chatsRoutes = require("./routes/chats");
const userRoutes = require('./routes/user')
const multer = require('multer');
const fileStorage = require('./utils/fileStorage');
const fileFiltering = require('./utils/fileFiltering');

const app = express();
dotenv.config();
//Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(multer({storage: fileStorage, fileFilter: fileFiltering}).single('display_picture'))

//routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", chatsRoutes);
app.use("/api/v1", userRoutes);

//Error Handling Middleware
app.use((error, req, res, next) => {
  console.log(error)
  let message = error.message;
  let status = error.statusCode;
  let data = error.data;
  return res.status(status).json({ message: message, error_details: data });
});

mongoose
  .connect(
    `mongodb+srv://kachi:${process.env.MONGODBPASSWORD}@blog.lqn85x7.mongodb.net/chatapp?retryWrites=true&w=majority`
  )
  .then((result) => {
    console.log("Connection to DB successful ...");
    app.listen("3000", () => {
      console.log("App is listening on port 3000");
    });
  })
  .catch((error) => {
    console.log(error);
  });
