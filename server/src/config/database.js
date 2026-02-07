// In-memory database for demo (replace with PostgreSQL in production)
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

// Initialize with sample data
const db = {
    users: [],
    bonusGames: [
        {
            id: uuidv4(),
            name: 'Lucky Wheel',
            gameType: 'wheel',
            description: 'Spin the wheel to win amazing bonuses!',
            icon: 'wheel',
            minBonus: 5,
            maxBonus: 500,
            cooldownHours: 24,
            vipTierRequired: 'Bronze',
            isActive: true,
            displayOrder: 1,
            bonusOptions: [
                { value: 5, label: '5 Credits', color: '#FF6B6B', probability: 30 },
                { value: 10, label: '10 Credits', color: '#4ECDC4', probability: 25 },
                { value: 25, label: '25 Credits', color: '#45B7D1', probability: 20 },
                { value: 50, label: '50 Credits', color: '#96CEB4', probability: 15 },
                { value: 100, label: '100 Credits', color: '#FFEAA7', probability: 7 },
                { value: 500, label: 'JACKPOT!', color: '#DDA0DD', probability: 3 },
            ]
        },
        {
            id: uuidv4(),
            name: 'Fortune Cookie',
            gameType: 'cookie',
            description: 'Break the cookie to reveal your bonus!',
            icon: 'cookie',
            minBonus: 10,
            maxBonus: 200,
            cooldownHours: 24,
            vipTierRequired: 'Bronze',
            isActive: true,
            displayOrder: 2,
            bonusOptions: [
                { value: 10, probability: 35 },
                { value: 20, probability: 30 },
                { value: 50, probability: 20 },
                { value: 100, probability: 10 },
                { value: 200, probability: 5 },
            ]
        },
        {
            id: uuidv4(),
            name: 'Scratch & Win',
            gameType: 'scratch',
            description: 'Scratch the card to uncover your prize!',
            icon: 'ticket',
            minBonus: 5,
            maxBonus: 300,
            cooldownHours: 24,
            vipTierRequired: 'Bronze',
            isActive: true,
            displayOrder: 3,
            bonusOptions: [
                { value: 5, probability: 30 },
                { value: 15, probability: 25 },
                { value: 30, probability: 20 },
                { value: 75, probability: 15 },
                { value: 150, probability: 7 },
                { value: 300, probability: 3 },
            ]
        }
    ],
    specialBonuses: [
        {
            id: uuidv4(),
            name: 'Daily Login Bonus',
            bonusType: 'daily_login',
            description: 'Login every day to claim your free bonus!',
            creditAmount: 10,
            pointAmount: 5,
            cooldownHours: 24,
            isActive: true
        },
        {
            id: uuidv4(),
            name: 'Weekly Mega Bonus',
            bonusType: 'weekly',
            description: 'Claim your weekly mega bonus every 7 days!',
            creditAmount: 100,
            pointAmount: 50,
            cooldownHours: 168,
            isActive: true
        }
    ],
    vipTiers: [
        { name: 'Bronze', pointsRequired: 0, bonusMultiplier: 1.00, iconColor: '#CD7F32' },
        { name: 'Silver', pointsRequired: 500, bonusMultiplier: 1.25, iconColor: '#C0C0C0' },
        { name: 'Gold', pointsRequired: 2000, bonusMultiplier: 1.50, iconColor: '#FFD700' },
        { name: 'Platinum', pointsRequired: 5000, bonusMultiplier: 2.00, iconColor: '#E5E4E2' }
    ],
    achievements: [
        { id: uuidv4(), name: 'First Spin', description: 'Play your first bonus game', icon: 'star', requirementType: 'games_played', requirementValue: 1, rewardCredits: 10, rewardPoints: 5 },
        { id: uuidv4(), name: 'Lucky 7', description: 'Play 7 bonus games', icon: 'trophy', requirementType: 'games_played', requirementValue: 7, rewardCredits: 50, rewardPoints: 25 },
        { id: uuidv4(), name: 'Networker', description: 'Refer your first friend', icon: 'users', requirementType: 'referrals', requirementValue: 1, rewardCredits: 25, rewardPoints: 15 },
    ],
    userGamePlays: [],
    userBonusClaims: [],
    userAchievements: [],
    referrals: [],
    transactions: [],
    notifications: []
};

// Create default admin user
const createDefaultAdmin = async () => {
    const existingAdmin = db.users.find(u => u.username === 'admin');
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        db.users.push({
            id: uuidv4(),
            username: 'admin',
            email: 'admin@loyaltyhub.com',
            passwordHash: hashedPassword,
            facebookName: null,
            bonusCredits: 0,
            loyaltyPoints: 0,
            vipTier: 'Platinum',
            referralCode: 'ADMIN2024',
            referredBy: null,
            loginStreak: 0,
            lastLoginDate: null,
            isAdmin: true,
            isActive: true,
            gamesPlayed: 0,
            referralCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
};

createDefaultAdmin();

module.exports = db;
