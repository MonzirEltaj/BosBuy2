const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: String,
    lastName: String,
    userId: String,
    password: String,
    cards: [{ type: Schema.Types.ObjectId, ref: 'Card' }], // Reference to Card documents
    defaultCard: { type: Schema.Types.ObjectId, ref: 'Card', default: null } // Reference to the default card
});

const User = mongoose.model("User", UserSchema);
module.exports = User;