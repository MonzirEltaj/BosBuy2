const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    userId: String,
    password: String,
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }],
    defaultCard: { type: Schema.Types.ObjectId, ref: 'Card', default: null } 
});

const User = mongoose.model("User", UserSchema);
module.exports = User;