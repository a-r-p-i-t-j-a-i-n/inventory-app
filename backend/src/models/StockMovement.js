const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    type: {
        type: String,
        enum: ['IN', 'OUT'],
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1'],
    },
    reason: { // Sale, Purchase, Damage, etc.
        type: String,
    },
    performedBy: { // Optional: User who did it
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);

module.exports = StockMovement;
