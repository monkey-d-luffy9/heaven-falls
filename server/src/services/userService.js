const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

// Calculate VIP tier based on loyalty points
const calculateVipTier = (points) => {
    if (points >= 5000) return 'PLATINUM';
    if (points >= 2000) return 'GOLD';
    if (points >= 500) return 'SILVER';
    return 'BRONZE';
};

// Get VIP multiplier
const getVipMultiplier = (tier) => {
    const multipliers = {
        BRONZE: 1,
        SILVER: 1.25,
        GOLD: 1.5,
        PLATINUM: 2
    };
    return multipliers[tier] || 1;
};

const userService = {
    // Create a new user
    async create(data) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const initialCredits = data.bonusCredits !== undefined ? data.bonusCredits : 0;

        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: hashedPassword,
                referredBy: data.referredBy,
                bonusCredits: initialCredits,
                role: data.role || 'USER'
            }
        });

        // Create welcome transaction
        await prisma.transaction.create({
            data: {
                userId: user.id,
                type: 'BONUS_CLAIM',
                creditChange: initialCredits,
                pointsChange: Math.floor(initialCredits / 10),
                description: initialCredits === 100 ? 'Welcome bonus credits' : `Initial credits from admin`
            }
        });

        // Create welcome notification
        await prisma.notification.create({
            data: {
                userId: user.id,
                title: 'Welcome!',
                message: initialCredits > 0 ? `You received ${initialCredits} bonus credits as a welcome gift!` : 'Welcome to Loyalty Hub!',
                type: 'BONUS'
            }
        });

        return this.sanitize(user);
    },

    // Find user by username
    async findByUsername(username) {
        return prisma.user.findUnique({
            where: { username }
        });
    },

    // Find user by ID
    async findById(id) {
        return prisma.user.findUnique({
            where: { id }
        });
    },

    // Find user by referral code
    async findByReferralCode(code) {
        return prisma.user.findUnique({
            where: { referralCode: code }
        });
    },

    // Update user
    async update(id, data) {
        // If password is being updated, hash it
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        // If loyaltyPoints changed, recalculate VIP tier
        if (data.loyaltyPoints !== undefined) {
            data.vipTier = calculateVipTier(data.loyaltyPoints);
        }

        const user = await prisma.user.update({
            where: { id },
            data
        });

        return this.sanitize(user);
    },

    // Verify password
    async verifyPassword(user, password) {
        return bcrypt.compare(password, user.password);
    },

    // Add credits to user
    async addCredits(userId, amount, type, description) {
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                bonusCredits: { increment: amount },
                loyaltyPoints: { increment: Math.floor(amount / 2) }
            }
        });

        // Recalculate VIP tier
        const newTier = calculateVipTier(user.loyaltyPoints);
        if (newTier !== user.vipTier) {
            await prisma.user.update({
                where: { id: userId },
                data: { vipTier: newTier }
            });
        }

        // Create transaction record
        await prisma.transaction.create({
            data: {
                userId,
                type,
                creditChange: amount,
                pointsChange: Math.floor(amount / 2),
                description
            }
        });

        return this.sanitize(user);
    },

    // Get user referrals
    async getReferrals(userId) {
        const referrals = await prisma.user.findMany({
            where: { referredBy: userId },
            select: {
                id: true,
                username: true,
                createdAt: true,
                vipTier: true
            }
        });

        // Calculate total earned from referrals
        const referralTransactions = await prisma.transaction.aggregate({
            where: {
                userId,
                type: 'REFERRAL_BONUS'
            },
            _sum: {
                creditChange: true
            }
        });

        return {
            referrals,
            totalEarned: referralTransactions._sum.creditChange || 0
        };
    },

    // Get all users (admin)
    async findAll(options = {}) {
        const { search, limit = 50, offset = 0 } = options;

        const where = search ? {
            OR: [
                { username: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ]
        } : {};

        const users = await prisma.user.findMany({
            where,
            take: limit,
            skip: offset,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                bonusCredits: true,
                loyaltyPoints: true,
                vipTier: true,
                isActive: true,
                createdAt: true
            }
        });

        const total = await prisma.user.count({ where });

        return { users, total };
    },

    // Sanitize user object (remove password, add computed properties)
    sanitize(user) {
        if (!user) return null;
        const { password, ...sanitized } = user;
        // Add computed isAdmin property for frontend convenience
        sanitized.isAdmin = user.role === 'ADMIN';
        return sanitized;
    },

    getVipMultiplier
};

module.exports = userService;
