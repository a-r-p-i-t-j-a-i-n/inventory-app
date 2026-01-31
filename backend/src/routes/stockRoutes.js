const express = require('express');
const router = express.Router();
const { addStockMovement, getDashboardStats } = require('../controllers/stockController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/', protect, admin, addStockMovement);
router.get('/dashboard', protect, getDashboardStats);

module.exports = router;
