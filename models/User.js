const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, require: true},
    uid: {type: String, unique: true, required: true},
    address: {type: Array, required: false},
    phone: {type: String, required: false},
    userType: {type: String, required: true, default: 'Client', enum: ['admin', 'Driver', 'Client', 'Vendor']},
    profile: {
        type: String,
        required: true,
        default: 'c:\Users\SYLVERGOLD\Pictures\pix.jpeg'
    }
}, {timestamps: true})

module.exports = mongoose.model('User', UserSchema)

