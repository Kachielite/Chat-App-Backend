const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageModel = new Schema({
    message: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
},{timestamps:true})

module.exports = mongoose.model('message', messageModel);