const express = require('express');
const bonusService = require('../services/bonusService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all bonuses with status
router.get('/', authenticateToken, async (req, res) => {
    try {
        const bonuses = await bonusService.getStatus(req.user.id);
        res.json(bonuses);
    } catch (error) {
        console.error('Get bonuses error:', error);
        res.status(500).json({ error: 'Failed to get bonuses' });
    }
});

// Claim a bonus
router.post('/:id/claim', authenticateToken, async (req, res) => {
    try {
        const result = await bonusService.claim(req.user.id, req.params.id);
        res.json(result);
    } catch (error) {
        console.error('Claim bonus error:', error);
        res.status(400).json({ error: error.message || 'Failed to claim bonus' });
    }
});

module.exports = router;
