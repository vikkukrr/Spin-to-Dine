const express = require('express');
const router = express.Router();
const { getSuggestions, logSpin, getSpinHistory, acceptSpinLog } = require('../controllers/spinController');
const { protect } = require('../middleware/authMiddleware');

router.get('/history/:userId', protect, getSpinHistory);
router.post('/log', protect, logSpin);
router.patch('/log/:logId/accept', protect, acceptSpinLog);
router.get('/:userId', protect, getSuggestions);

module.exports = router;
