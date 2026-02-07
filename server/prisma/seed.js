const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            email: 'admin@loyaltyhub.com',
            password: adminPassword,
            role: 'ADMIN',
            bonusCredits: 10000,
            loyaltyPoints: 10000,
            vipTier: 'PLATINUM'
        }
    });
    console.log('✅ Admin user created:', admin.username);

    // Create games
    const games = await Promise.all([
        prisma.game.upsert({
            where: { id: 'wheel-game' },
            update: {},
            create: {
                id: 'wheel-game',
                name: 'Lucky Wheel',
                description: 'Spin the wheel to win credits!',
                type: 'WHEEL',
                minReward: 5,
                maxReward: 100,
                cooldownHours: 24
            }
        }),
        prisma.game.upsert({
            where: { id: 'cookie-game' },
            update: {},
            create: {
                id: 'cookie-game',
                name: 'Fortune Cookie',
                description: 'Crack the cookie to reveal your fortune!',
                type: 'COOKIE',
                minReward: 10,
                maxReward: 75,
                cooldownHours: 24
            }
        }),
        prisma.game.upsert({
            where: { id: 'scratch-game' },
            update: {},
            create: {
                id: 'scratch-game',
                name: 'Scratch Card',
                description: 'Scratch to reveal hidden prizes!',
                type: 'SCRATCH',
                minReward: 5,
                maxReward: 150,
                cooldownHours: 24
            }
        })
    ]);
    console.log('✅ Games created:', games.length);

    // Create bonuses
    const bonuses = await Promise.all([
        prisma.bonus.upsert({
            where: { id: 'daily-login' },
            update: {},
            create: {
                id: 'daily-login',
                name: 'Daily Login Bonus',
                description: 'Claim your daily bonus credits!',
                type: 'DAILY_LOGIN',
                creditAmount: 25,
                pointsAmount: 10,
                cooldownHours: 24
            }
        }),
        prisma.bonus.upsert({
            where: { id: 'weekly-mega' },
            update: {},
            create: {
                id: 'weekly-mega',
                name: 'Weekly Mega Bonus',
                description: 'Big weekly reward for loyal players!',
                type: 'WEEKLY',
                creditAmount: 100,
                pointsAmount: 50,
                cooldownHours: 168 // 7 days
            }
        }),
        prisma.bonus.upsert({
            where: { id: 'streak-bonus' },
            update: {},
            create: {
                id: 'streak-bonus',
                name: 'Streak Master',
                description: 'Bonus for 7-day login streak',
                type: 'STREAK',
                creditAmount: 75,
                pointsAmount: 35,
                cooldownHours: 168,
                streakRequired: 7
            }
        })
    ]);
    console.log('✅ Bonuses created:', bonuses.length);

    // Create achievements
    const achievements = await Promise.all([
        prisma.achievement.upsert({
            where: { id: 'first-game' },
            update: {},
            create: {
                id: 'first-game',
                name: 'First Spin',
                description: 'Play your first bonus game',
                type: 'GAMES',
                requirement: 1,
                rewardCredits: 10,
                rewardPoints: 5
            }
        }),
        prisma.achievement.upsert({
            where: { id: 'game-enthusiast' },
            update: {},
            create: {
                id: 'game-enthusiast',
                name: 'Game Enthusiast',
                description: 'Play 10 bonus games',
                type: 'GAMES',
                requirement: 10,
                rewardCredits: 50,
                rewardPoints: 25
            }
        }),
        prisma.achievement.upsert({
            where: { id: 'game-master' },
            update: {},
            create: {
                id: 'game-master',
                name: 'Game Master',
                description: 'Play 50 bonus games',
                type: 'GAMES',
                requirement: 50,
                rewardCredits: 200,
                rewardPoints: 100
            }
        }),
        prisma.achievement.upsert({
            where: { id: 'streak-starter' },
            update: {},
            create: {
                id: 'streak-starter',
                name: 'Streak Starter',
                description: 'Maintain a 3-day login streak',
                type: 'STREAK',
                requirement: 3,
                rewardCredits: 25,
                rewardPoints: 15
            }
        }),
        prisma.achievement.upsert({
            where: { id: 'streak-champion' },
            update: {},
            create: {
                id: 'streak-champion',
                name: 'Streak Champion',
                description: 'Maintain a 7-day login streak',
                type: 'STREAK',
                requirement: 7,
                rewardCredits: 75,
                rewardPoints: 50
            }
        }),
        prisma.achievement.upsert({
            where: { id: 'silver-member' },
            update: {},
            create: {
                id: 'silver-member',
                name: 'Silver Status',
                description: 'Reach Silver VIP tier',
                type: 'VIP',
                requirement: 500,
                rewardCredits: 100,
                rewardPoints: 0
            }
        }),
        prisma.achievement.upsert({
            where: { id: 'gold-member' },
            update: {},
            create: {
                id: 'gold-member',
                name: 'Gold Status',
                description: 'Reach Gold VIP tier',
                type: 'VIP',
                requirement: 2000,
                rewardCredits: 250,
                rewardPoints: 0
            }
        })
    ]);
    console.log('✅ Achievements created:', achievements.length);

    console.log('');
    console.log('🎉 Database seeded successfully!');
    console.log('');
    console.log('🔐 Admin credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
