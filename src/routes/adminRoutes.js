const express = require('express');
const router = express.Router();
const authAdmin = require('../middlewares/authAdmin');
const adminController = require('../controllers/adminController');
const authorizeRoles = require('../middlewares/authorizeRoles');
const {authenticateUser} = require('../middlewares/authMiddleware');
const {updateEventStatus} = require('../controllers/eventsController');



router.get('/fetchlivedata', authAdmin, adminController.fetchLiveData);
router.put('/event/:id/status', authenticateUser, authorizeRoles('admin'), updateEventStatus);

module.exports = router;
