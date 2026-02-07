const express = require('express');
const transactionService = require('../services/transactionService');
const achievementService = require('../services/achievementService');
const userService = require('../services/userService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user transactions
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { type, limit, offset } = req.query;
        const result = await transactionService.findByUser(req.user.id, {
            type,
            limit: parseInt(limit) || 50,
            offset: parseInt(offset) || 0
        });
        res.json(result);
    } catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Failed to get transactions' });
    }
});

// Get user achievements
router.get('/achievements', authenticateToken, async (req, res) => {
    try {
        const achievements = await achievementService.getUserAchievements(req.user.id);
        res.json({ achievements });
    } catch (error) {
        console.error('Get achievements error:', error);
        res.status(500).json({ error: 'Failed to get achievements' });
    }
});

// Get user referrals
router.get('/referrals', authenticateToken, async (req, res) => {
    try {
        const referrals = await userService.getReferrals(req.user.id);
        res.json(referrals);
    } catch (error) {
        console.error('Get referrals error:', error);
        res.status(500).json({ error: 'Failed to get referrals' });
    }
});

// Get VIP info
router.get('/vip', authenticateToken, async (req, res) => {
    try {
        const user = await userService.findById(req.user.id);
        const stats = await transactionService.getStats(req.user.id);

        const tiers = [
            { name: 'BRONZE', pointsRequired: 0, multiplier: 1 },
            { name: 'SILVER', pointsRequired: 500, multiplier: 1.25 },
            { name: 'GOLD', pointsRequired: 2000, multiplier: 1.5 },
            { name: 'PLATINUM', pointsRequired: 5000, multiplier: 2 }
        ];

        const currentTierIndex = tiers.findIndex(t => t.name === user.vipTier);
        const currentTier = tiers[currentTierIndex];
        const nextTier = tiers[currentTierIndex + 1];

        res.json({
            currentTier: user.vipTier,
            loyaltyPoints: user.loyaltyPoints,
            multiplier: currentTier.multiplier,
            nextTier: nextTier ? {
                name: nextTier.name,
                pointsRequired: nextTier.pointsRequired,
                pointsNeeded: nextTier.pointsRequired - user.loyaltyPoints
            } : null,
            stats
        });
    } catch (error) {
        console.error('Get VIP info error:', error);
        res.status(500).json({ error: 'Failed to get VIP info' });
    }
});

module.exports = router;
