const stockService = require('../services/stockService');

// @desc    Record Stock Movement (In/Out)
// @route   POST /api/stock
// @access  Private/Admin
const addStockMovement = async (req, res, next) => {
    try {
        const movement = await stockService.recordMovement(req.user._id, req.body);
        res.status(201).json(movement);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

// @desc    Get Dashboard Stats
// @route   GET /api/stock/dashboard
// @access  Private
const getDashboardStats = async (req, res, next) => {
    try {
        const stats = await stockService.getStats();
        res.json(stats);
    } catch (error) {
        res.status(500);
        next(error);
    }
};

module.exports = { addStockMovement, getDashboardStats };
