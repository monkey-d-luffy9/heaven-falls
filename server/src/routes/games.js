const express = require('express');
const gameService = require('../services/gameService');
const achievementService = require('../services/achievementService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all games
router.get('/', authenticateToken, async (req, res) => {
    try {
        const games = await gameService.findAll();
        res.json(games);
    } catch (error) {
        console.error('Get games error:', error);
        res.status(500).json({ error: 'Failed to get games' });
    }
});

// Get game status (with cooldowns)
router.get('/status', authenticateToken, async (req, res) => {
    try {
        const status = await gameService.getStatus(req.user.id);
        res.json(status);
    } catch (error) {
        console.error('Get game status error:', error);
        res.status(500).json({ error: 'Failed to get game status' });
    }
});

// Play a game
router.post('/:id/play', authenticateToken, async (req, res) => {
    try {
        const result = await gameService.play(req.user.id, req.params.id);

        // Check for achievements
        await achievementService.checkAchievements(req.user.id);

        res.json(result);
    } catch (error) {
        console.error('Play game error:', error);
        res.status(400).json({ error: error.message || 'Failed to play game' });
    }
});

module.exports = router;
