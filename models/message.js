const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    uid: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    body: { type: String, required: true },
    timestamp: { type: Date, required: true },
    image: { type: String, required: false }
});

module.exports = mongoose.model("Message", MessageSchema);