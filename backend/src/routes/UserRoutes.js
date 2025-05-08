const express = require('express');
const { updateUser } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// PUT /api/users/update
router.put('/update', authMiddleware, updateUser);

module.exports = router;
