//Create the scheme
//Creates user first than creates profile
//Mongoose model

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('user', userSchema); //mongoose model takes in 2 parameters, the model name ('user') and the schema (userSchema)