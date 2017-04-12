const mongoose = require('mongoose')

const Schema = mongoose.Schema

const userSchema = mongoose.Schema({
    token           : String,
    email           : String,
    hashed_password : String,
    salt            : String,
    temp_str        : String
});

mongoose.connect('mongodb://localhost:27017/node-android')
module.exports = mongoose.model('users', userSchema)