const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const mongoose = require('mongoose');

const recordMovement = async (userId, { productId, type, quantity, reason }) => {
    if (quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const product = await Product.findById(productId).session(session);

        if (!product) {
            throw new Error('Product not found');
        }

        let newQuantity = product.quantity;
        if (type === 'IN') {
            newQuantity += quantity;
        } else if (type === 'OUT') {
            newQuantity -= quantity;
        } else {
            throw new Error('Invalid movement type');
        }

        if (newQuantity < 0) {
            throw new Error('Insufficient stock for this operation');
        }

        product.quantity = newQuantity;
        await product.save({ session });

        const movement = new StockMovement({
            product: productId,
            type,
            quantity,
            reason,
            performedBy: userId,
        });
        await movement.save({ session });

        await session.commitTransaction();
        return movement;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

const getStats = async () => {
    const totalProducts = await Product.countDocuments();

    const lowStockProducts = await Product.find({
        $expr: { $lte: ['$quantity', '$lowStockThreshold'] }
    }).select('name sku quantity lowStockThreshold');

    const recentMovements = await StockMovement.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('product', 'name sku')
        .populate('performedBy', 'username');

    return {
        totalProducts,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentMovements,
    };
};

module.exports = { recordMovement, getStats };
