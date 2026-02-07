const express = require('express');
const jwt = require('jsonwebtoken');
const userService = require('../services/userService');
const config = require('../config');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, referralCode } = req.body;

        // Validate input
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        // Check if username exists
        const existingUser = await userService.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Handle referral
        let referrerId = null;
        if (referralCode) {
            const referrer = await userService.findByReferralCode(referralCode);
            if (referrer) {
                referrerId = referrer.id;
                // Give referral bonus to referrer
                await userService.addCredits(
                    referrer.id,
                    config.referrerBonus,
                    'REFERRAL_BONUS',
                    `Referral bonus for inviting ${username}`
                );
            }
        }

        // Create user
        const user = await userService.create({
            username,
            email,
            password,
            referredBy: referrerId
        });

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpires }
        );

        res.status(201).json({
            user,
            token
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message || 'Registration failed' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user
        const user = await userService.findByUsername(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await userService.verifyPassword(user, password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Update last login and streak
        const now = new Date();
        const lastLogin = user.lastLogin;
        let newStreak = user.loginStreak;

        if (lastLogin) {
            const hoursSinceLogin = (now - lastLogin) / (1000 * 60 * 60);
            if (hoursSinceLogin >= 24 && hoursSinceLogin < 48) {
                // Consecutive day login - increment streak
                newStreak += 1;
            } else if (hoursSinceLogin >= 48) {
                // Streak broken
                newStreak = 1;
            }
            // Within same day - keep streak
        } else {
            newStreak = 1;
        }

        await userService.update(user.id, {
            lastLogin: now,
            loginStreak: newStreak
        });

        // Generate token
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            config.jwtSecret,
            { expiresIn: config.jwtExpires }
        );

        res.json({
            user: userService.sanitize(user),
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await userService.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(userService.sanitize(user));
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// Update profile
router.put('/me', authenticateToken, async (req, res) => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        const updates = {};

        if (email) {
            updates.email = email;
        }

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: 'Current password required' });
            }

            const user = await userService.findById(req.user.id);
            const isValid = await userService.verifyPassword(user, currentPassword);
            if (!isValid) {
                return res.status(401).json({ error: 'Current password is incorrect' });
            }

            updates.password = newPassword;
        }

        const user = await userService.update(req.user.id, updates);
        res.json(user);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

module.exports = router;
