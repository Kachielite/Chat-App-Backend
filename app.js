const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authentication");
const chatsRoutes = require("./routes/chats");
const userRoutes = require("./routes/user");
const multer = require("multer");
const fileStorage = require("./utils/fileStorage");
const fileFiltering = require("./utils/fileFiltering");
const User = require("./models/user");
const { isContext } = require("vm");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
let userId;
dotenv.config();
//Middleware
app.use(cors());
app.use((req, res, next) => {
  userId = req.userId;
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Origin"
  );
  next();
});
app.use(bodyParser.json());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFiltering }).single(
    "display_picture"
  )
);

//routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", chatsRoutes);
app.use("/api/v1", userRoutes);

//Error Handling Middleware
app.use((error, req, res, next) => {
  console.log(error);
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
    httpServer.listen(8080, () => {
      console.log("Server listening on port 8080");
    });
    let username;
    io.on("connection", (socket) => {
      socket.on("join", (data) => {
        const username = data;
        socket.broadcast.to("chatroom").emit("message", username);
        socket.join("chatroom");
      });
      socket.on("left", (data) => {
        let username;
        console.log(data);
        username = data;
        socket.broadcast.to("chatroom").emit("leftChatroom", username);
        socket.leave("chatroom");
      });


    });
  })
  .catch((error) => {
    console.log(error);
  });

app.set("socketio", io); //here you export my socket.io to a global

io.on("signedOut", (data) => {
  io.to("chat room").emit("user gone");
});
