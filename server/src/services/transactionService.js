const prisma = require('../lib/prisma');

const transactionService = {
    // Get user transactions
    async findByUser(userId, options = {}) {
        const { type, limit = 50, offset = 0 } = options;

        const where = { userId };
        if (type) {
            where.type = type;
        }

        const transactions = await prisma.transaction.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' }
        });

        const total = await prisma.transaction.count({ where });

        return { transactions, total };
    },

    // Get user stats
    async getStats(userId) {
        const totalCreditsEarned = await prisma.transaction.aggregate({
            where: { userId, creditChange: { gt: 0 } },
            _sum: { creditChange: true }
        });

        const gamesWon = await prisma.transaction.count({
            where: { userId, type: 'GAME_WIN' }
        });

        const bonusesClaimed = await prisma.transaction.count({
            where: { userId, type: 'BONUS_CLAIM' }
        });

        return {
            totalCreditsEarned: totalCreditsEarned._sum.creditChange || 0,
            gamesWon,
            bonusesClaimed
        };
    }
};

module.exports = transactionService;
