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


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
const PORT = process.env.PORT || 8080;
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
app.use(bodyParser.json({limit: '50mb'}));
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
    httpServer.listen(PORT, () => {
      console.log(`server started on port ${PORT}`);
    });
    io.on("connection", (socket) => {
      //Notify all users that a new user has joined
      socket.on("join", (user) => {
        socket.broadcast.to("chatroom").emit("message", user);
        socket.join("chatroom");
      });

      //Notify all users that a new user has joined
      socket.on("left", user => {
        socket.broadcast.to("chatroom").emit("leftChatroom", user);
        socket.leave("chatroom");
      });

      socket.on("typing", user => {
        socket.broadcast.to("chatroom").emit("is-typing", user.username);
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });

app.set("socketio", io); //here you export my socket.io to a global
