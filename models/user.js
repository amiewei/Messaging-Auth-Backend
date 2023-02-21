const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  uid: { type: String, required: true },
  displayName: { type: String, required: true },
  email: { type: String, required: true },
  isAdmin: { type: Boolean, required: true },
});
module.exports = mongoose.model("User", UserSchema);
