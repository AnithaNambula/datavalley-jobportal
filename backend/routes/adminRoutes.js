const express = require('express');
const router = express.Router();
const { getAllUsers, getStats, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All admin routes require login + admin role
router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
