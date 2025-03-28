const express = require('express');
const { authenticateUser } = require('../middlewares/authMiddleware');
const authorizeRoles = require('../middlewares/authorizeRoles');
const { createTrade, getAllTrades, updateTradeStatus } = require('../controllers/tradeController');

const router = express.Router();

router.post('/', authenticateUser, authorizeRoles('user', 'admin'), createTrade);
router.get('/', authenticateUser, authorizeRoles('admin'), getAllTrades);
router.put('/:id', authenticateUser, authorizeRoles('admin'), updateTradeStatus);

module.exports = router;
