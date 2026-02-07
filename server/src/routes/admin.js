const express = require('express');
const prisma = require('../lib/prisma');
const userService = require('../services/userService');
const gameService = require('../services/gameService');
const bonusService = require('../services/bonusService');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);

// Get admin stats
router.get('/stats', async (req, res) => {
    try {
        const [totalUsers, activeUsers, totalGames, totalBonuses, usersByTier, totalCredits] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { isActive: true } }),
            prisma.game.count({ where: { isActive: true } }),
            prisma.bonus.count({ where: { isActive: true } }),
            prisma.user.groupBy({
                by: ['vipTier'],
                _count: true
            }),
            prisma.user.aggregate({
                _sum: { bonusCredits: true }
            })
        ]);

        // Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [creditsToday, gamesPlayedToday] = await Promise.all([
            prisma.transaction.aggregate({
                where: {
                    createdAt: { gte: today }
                },
                _sum: { creditChange: true }
            }),
            prisma.gameHistory.count({
                where: { playedAt: { gte: today } }
            })
        ]);

        // Build VIP distribution with proper key casing (Bronze, Silver, Gold, Platinum)
        const vipDistribution = {};
        usersByTier.forEach(item => {
            // Convert BRONZE -> Bronze, etc.
            const tierName = item.vipTier.charAt(0) + item.vipTier.slice(1).toLowerCase();
            vipDistribution[tierName] = item._count;
        });

        res.json({
            totalUsers,
            activeUsers,
            totalGames,
            totalBonuses,
            todayCreditsGiven: creditsToday._sum.creditChange || 0,
            todayGamesPlayed: gamesPlayedToday,
            totalCreditsInCirculation: totalCredits._sum.bonusCredits || 0,
            vipDistribution
        });
    } catch (error) {
        console.error('Get admin stats error:', error);
        res.status(500).json({ error: 'Failed to get stats' });
    }
});

// ===== USER MANAGEMENT =====

// Get all users
router.get('/users', async (req, res) => {
    try {
        const { search, limit, offset } = req.query;
        const result = await userService.findAll({
            search,
            limit: parseInt(limit) || 50,
            offset: parseInt(offset) || 0
        });
        res.json(result);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to get users' });
    }
});

// Get single user
router.get('/users/:id', async (req, res) => {
    try {
        const user = await userService.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(userService.sanitize(user));
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// Create user
router.post('/users', async (req, res) => {
    try {
        const { username, email, password, role, bonusCredits } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const existing = await userService.findByUsername(username);
        if (existing) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const user = await userService.create({
            username,
            email,
            password,
            role: role || 'USER',
            bonusCredits: parseFloat(bonusCredits) || 100 // Default 100 if not specified
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Update user
router.put('/users/:id', async (req, res) => {
    try {
        const user = await userService.update(req.params.id, req.body);
        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Add bonus credits to user
router.post('/users/:id/bonus', async (req, res) => {
    try {
        const { amount, reason } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Valid amount required' });
        }

        await userService.addCredits(
            req.params.id,
            amount,
            'ADMIN_CREDIT',
            reason || 'Admin bonus credit'
        );

        const user = await userService.findById(req.params.id);
        res.json(userService.sanitize(user));
    } catch (error) {
        console.error('Add bonus error:', error);
        res.status(500).json({ error: 'Failed to add bonus' });
    }
});

// ===== GAME MANAGEMENT =====

// Get all games
router.get('/games', async (req, res) => {
    try {
        const games = await prisma.game.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(games);
    } catch (error) {
        console.error('Get games error:', error);
        res.status(500).json({ error: 'Failed to get games' });
    }
});

// Create game
router.post('/games', async (req, res) => {
    try {
        const game = await gameService.create(req.body);
        res.status(201).json(game);
    } catch (error) {
        console.error('Create game error:', error);
        res.status(500).json({ error: 'Failed to create game' });
    }
});

// Update game
router.put('/games/:id', async (req, res) => {
    try {
        const game = await gameService.update(req.params.id, req.body);
        res.json(game);
    } catch (error) {
        console.error('Update game error:', error);
        res.status(500).json({ error: 'Failed to update game' });
    }
});

// Delete game
router.delete('/games/:id', async (req, res) => {
    try {
        await gameService.delete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete game error:', error);
        res.status(500).json({ error: 'Failed to delete game' });
    }
});

// ===== BONUS MANAGEMENT =====

// Get all bonuses
router.get('/bonuses', async (req, res) => {
    try {
        const bonuses = await prisma.bonus.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(bonuses);
    } catch (error) {
        console.error('Get bonuses error:', error);
        res.status(500).json({ error: 'Failed to get bonuses' });
    }
});

// Create bonus
router.post('/bonuses', async (req, res) => {
    try {
        const bonus = await bonusService.create(req.body);
        res.status(201).json(bonus);
    } catch (error) {
        console.error('Create bonus error:', error);
        res.status(500).json({ error: 'Failed to create bonus' });
    }
});

// Update bonus
router.put('/bonuses/:id', async (req, res) => {
    try {
        const bonus = await bonusService.update(req.params.id, req.body);
        res.json(bonus);
    } catch (error) {
        console.error('Update bonus error:', error);
        res.status(500).json({ error: 'Failed to update bonus' });
    }
});

module.exports = router;
