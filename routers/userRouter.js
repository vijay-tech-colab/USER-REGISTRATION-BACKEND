const express = require('express');
const { regstration, login, getProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/register',regstration);
router.post('/login',login);
router.get('/get-profile', authMiddleware,getProfile);
module.exports = router;