const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    screenPermission: {
        type: Boolean,
        default: false,
    },
    webcamPermission: {
        type: Boolean,
        default: false,
    },
    audioPermission: {
        type: Boolean,
        default: false,
    }
})

module.exports = mongoose.model("Users", userSchema);