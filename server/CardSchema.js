const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    cardNumber: { type: String, required: true, match: [/^\d{16}$/, 'Invalid card number'] },
    cardName: { type: String, required: true },
    expirationDate: { type: String, required: true, match: [/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiration date'] },
    cvv: { type: String, required: true, match: [/^\d{3}$/, 'Invalid CVV'] },
    zipCode: { type: String, required: true, match: [/^\d{5}$/, 'Invalid ZIP code'] }
});

const Card = mongoose.model("Card", CardSchema);
module.exports = Card;