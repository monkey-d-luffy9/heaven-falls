const prisma = require('../lib/prisma');
const userService = require('./userService');

const bonusService = {
    // Get all active bonuses
    async findAll() {
        return prisma.bonus.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'asc' }
        });
    },

    // Get bonus by ID
    async findById(id) {
        return prisma.bonus.findUnique({
            where: { id }
        });
    },

    // Get user's bonus status (what's available to claim)
    async getStatus(userId) {
        const bonuses = await this.findAll();
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const now = new Date();

        const bonusStatus = await Promise.all(
            bonuses.map(async (bonus) => {
                const lastClaim = await prisma.bonusClaim.findFirst({
                    where: { userId, bonusId: bonus.id },
                    orderBy: { claimedAt: 'desc' }
                });

                let isAvailable = true;
                let nextAvailable = null;

                // Check cooldown
                if (lastClaim) {
                    const cooldownMs = bonus.cooldownHours * 60 * 60 * 1000;
                    const nextTime = new Date(lastClaim.claimedAt.getTime() + cooldownMs);

                    if (nextTime > now) {
                        isAvailable = false;
                        nextAvailable = nextTime;
                    }
                }

                // Check streak requirement
                if (bonus.streakRequired > 0 && user.loginStreak < bonus.streakRequired) {
                    isAvailable = false;
                }

                return {
                    ...bonus,
                    isAvailable,
                    nextAvailable,
                    lastClaimed: lastClaim?.claimedAt || null,
                    userStreak: user.loginStreak
                };
            })
        );

        return bonusStatus;
    },

    // Claim a bonus
    async claim(userId, bonusId) {
        const bonus = await this.findById(bonusId);
        if (!bonus || !bonus.isActive) {
            throw new Error('Bonus not found');
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });

        // Check cooldown
        const lastClaim = await prisma.bonusClaim.findFirst({
            where: { userId, bonusId },
            orderBy: { claimedAt: 'desc' }
        });

        if (lastClaim) {
            const cooldownMs = bonus.cooldownHours * 60 * 60 * 1000;
            const nextTime = new Date(lastClaim.claimedAt.getTime() + cooldownMs);

            if (nextTime > new Date()) {
                throw new Error('Bonus is on cooldown');
            }
        }

        // Check streak requirement
        if (bonus.streakRequired > 0 && user.loginStreak < bonus.streakRequired) {
            throw new Error(`Requires ${bonus.streakRequired} day streak`);
        }

        // Calculate reward with VIP multiplier
        const multiplier = userService.getVipMultiplier(user.vipTier);
        const amount = Math.round(bonus.creditAmount * multiplier * 100) / 100;

        // Record claim
        await prisma.bonusClaim.create({
            data: {
                userId,
                bonusId,
                amount
            }
        });

        // Add credits
        await userService.addCredits(
            userId,
            amount,
            'BONUS_CLAIM',
            `Claimed ${bonus.name}`
        );

        // Create notification
        await prisma.notification.create({
            data: {
                userId,
                title: 'Bonus Claimed!',
                message: `You received ${amount} credits from ${bonus.name}`,
                type: 'BONUS'
            }
        });

        return {
            bonus,
            amount,
            multiplier
        };
    },

    // Create bonus (admin)
    async create(data) {
        return prisma.bonus.create({
            data: {
                name: data.name,
                description: data.description,
                type: data.type,
                creditAmount: data.creditAmount || 10,
                pointsAmount: data.pointsAmount || 5,
                cooldownHours: data.cooldownHours || 24,
                streakRequired: data.streakRequired || 0
            }
        });
    },

    // Update bonus (admin)
    async update(id, data) {
        return prisma.bonus.update({
            where: { id },
            data
        });
    }
};

module.exports = bonusService;
