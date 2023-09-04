const mongoose = require("mongoose");
const User = require("./user");

const Schema = mongoose.Schema;

const recordSchema = new Schema({
    user: {
        type: Schema.ObjectId,
        ref: User,
        required: true,
    },
    startTime: {
        type: String,
    },
    endTime: {
        type: String,
    },
    duration_in_seconds: {
        type: Number,
    },
    filePath: {
        type: String,
        default: null,
        required: true,
    }
});

module.exports = mongoose.model("Recordings", recordSchema);