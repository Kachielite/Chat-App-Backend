const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

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


mongoose.connect('mongodb+srv://kachi:Madumere281091@blog.lqn85x7.mongodb.net/socialMedia?retryWrites=true&w=majority').then(result =>{
    console.log('Connection to DB successful ...')
    app.listen("3000", () => {
      console.log("App is listening on port 3000");
    });
}).catch(error =>{
    console.log(error)
})

