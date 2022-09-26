const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userModel = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  display_picture_url:{
    type: String,
  },
  display_picture_public_id:{
    type: String,
  },
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: "messages",
    },
  ],
},{timestamps: true});

module.exports = mongoose.model('user', userModel);