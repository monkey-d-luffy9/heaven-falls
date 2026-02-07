const prisma = require('../lib/prisma');
const userService = require('./userService');

const gameService = {
    // Get all active games
    async findAll() {
        return prisma.game.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
        });
    },

    // Get game by ID
    async findById(id) {
        return prisma.game.findUnique({
            where: { id }
        });
    },

    // Get user's game status (cooldowns)
    async getStatus(userId) {
        const games = await this.findAll();
        const now = new Date();

        // Get last play time for each game
        const gameStatus = await Promise.all(
            games.map(async (game) => {
                const lastPlay = await prisma.gameHistory.findFirst({
                    where: { userId, gameId: game.id },
                    orderBy: { playedAt: 'desc' }
                });

                let isAvailable = true;
                let nextAvailable = null;

                if (lastPlay) {
                    const cooldownMs = game.cooldownHours * 60 * 60 * 1000;
                    const nextTime = new Date(lastPlay.playedAt.getTime() + cooldownMs);

                    if (nextTime > now) {
                        isAvailable = false;
                        nextAvailable = nextTime;
                    }
                }

                return {
                    ...game,
                    isAvailable,
                    nextAvailable,
                    lastPlayed: lastPlay?.playedAt || null
                };
            })
        );

        return gameStatus;
    },

    // Play a game
    async play(userId, gameId) {
        const game = await this.findById(gameId);
        if (!game || !game.isActive) {
            throw new Error('Game not found');
        }

        // Check cooldown
        const lastPlay = await prisma.gameHistory.findFirst({
            where: { userId, gameId },
            orderBy: { playedAt: 'desc' }
        });

        if (lastPlay) {
            const cooldownMs = game.cooldownHours * 60 * 60 * 1000;
            const nextTime = new Date(lastPlay.playedAt.getTime() + cooldownMs);

            if (nextTime > new Date()) {
                throw new Error('Game is on cooldown');
            }
        }

        // Get user for VIP multiplier
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const multiplier = userService.getVipMultiplier(user.vipTier);

        // Calculate reward
        const baseReward = Math.random() * (game.maxReward - game.minReward) + game.minReward;
        const reward = Math.round(baseReward * multiplier * 100) / 100;

        // Record game play
        await prisma.gameHistory.create({
            data: {
                userId,
                gameId,
                result: reward
            }
        });

        // Update user stats
        await prisma.user.update({
            where: { id: userId },
            data: {
                gamesPlayed: { increment: 1 }
            }
        });

        // Add credits
        await userService.addCredits(
            userId,
            reward,
            'GAME_WIN',
            `Won ${reward} credits from ${game.name}`
        );

        return {
            game,
            reward,
            multiplier
        };
    },

    // Create game (admin)
    async create(data) {
        return prisma.game.create({
            data: {
                name: data.name,
                description: data.description,
                type: data.type,
                imageUrl: data.imageUrl,
                minReward: data.minReward || 5,
                maxReward: data.maxReward || 50,
                cooldownHours: data.cooldownHours || 24
            }
        });
    },

    // Update game (admin)
    async update(id, data) {
        return prisma.game.update({
            where: { id },
            data
        });
    },

    // Delete game (admin)
    async delete(id) {
        return prisma.game.update({
            where: { id },
            data: { isActive: false }
        });
    }
};

module.exports = gameService;
