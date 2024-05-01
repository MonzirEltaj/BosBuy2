const mongoose = require('mongoose');

const ReceiptSchema = new mongoose.Schema({
    receiptNumber: {
        type: String,
        required: true,
        unique: true
    },
    receiptCount: {  // Ensure this field is correctly defined
        type: Number,
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true
        },
        unitPrice: {
            type: Number,
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    cardUsed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Receipt = mongoose.model('Receipt', ReceiptSchema);
module.exports = Receipt;