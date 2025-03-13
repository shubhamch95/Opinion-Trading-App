const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');  // ✅ Import controller
const authAdmin = require('../../src/middlewares/authAdmin');

router.post('/events', authAdmin, adminController.createEvent);
router.get('/events', authAdmin, adminController.getAllEvents);
router.delete('/events/:id', authAdmin, adminController.deleteEvent);

router.post('/trades', authAdmin, adminController.createTrade);
router.get('/trades', authAdmin, adminController.getAllTrades);
router.put('/trades/:id', authAdmin, adminController.updateTradeStatus);

module.exports = router;
