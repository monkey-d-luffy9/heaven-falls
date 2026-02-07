const prisma = require('../lib/prisma');

const achievementService = {
    // Get all achievements
    async findAll() {
        return prisma.achievement.findMany({
            orderBy: { requirement: 'asc' }
        });
    },

    // Get user achievements with progress
    async getUserAchievements(userId) {
        const achievements = await this.findAll();
        const user = await prisma.user.findUnique({ where: { id: userId } });

        const userAchievements = await prisma.userAchievement.findMany({
            where: { userId }
        });

        const achievementMap = new Map(
            userAchievements.map(ua => [ua.achievementId, ua])
        );

        return achievements.map(achievement => {
            const userAchievement = achievementMap.get(achievement.id);

            // Calculate progress based on achievement type
            let progress = 0;
            switch (achievement.type) {
                case 'GAMES':
                    progress = user.gamesPlayed;
                    break;
                case 'STREAK':
                    progress = user.loginStreak;
                    break;
                case 'VIP':
                    progress = user.loyaltyPoints;
                    break;
                default:
                    progress = userAchievement?.progress || 0;
            }

            return {
                ...achievement,
                progress,
                isUnlocked: userAchievement?.isUnlocked || false,
                unlockedAt: userAchievement?.unlockedAt
            };
        });
    },

    // Check and unlock achievements for user
    async checkAchievements(userId) {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const achievements = await this.findAll();
        const unlocked = [];

        for (const achievement of achievements) {
            // Check if already unlocked
            const existing = await prisma.userAchievement.findUnique({
                where: {
                    userId_achievementId: { userId, achievementId: achievement.id }
                }
            });

            if (existing?.isUnlocked) continue;

            // Check if requirement met
            let progress = 0;
            switch (achievement.type) {
                case 'GAMES':
                    progress = user.gamesPlayed;
                    break;
                case 'STREAK':
                    progress = user.loginStreak;
                    break;
                case 'VIP':
                    progress = user.loyaltyPoints;
                    break;
            }

            if (progress >= achievement.requirement) {
                // Unlock achievement
                await prisma.userAchievement.upsert({
                    where: {
                        userId_achievementId: { userId, achievementId: achievement.id }
                    },
                    create: {
                        userId,
                        achievementId: achievement.id,
                        progress,
                        isUnlocked: true,
                        unlockedAt: new Date()
                    },
                    update: {
                        progress,
                        isUnlocked: true,
                        unlockedAt: new Date()
                    }
                });

                // Award rewards
                if (achievement.rewardCredits > 0) {
                    const userService = require('./userService');
                    await userService.addCredits(
                        userId,
                        achievement.rewardCredits,
                        'ACHIEVEMENT',
                        `Unlocked achievement: ${achievement.name}`
                    );
                }

                // Create notification
                await prisma.notification.create({
                    data: {
                        userId,
                        title: 'Achievement Unlocked!',
                        message: `You unlocked "${achievement.name}" and earned ${achievement.rewardCredits} credits!`,
                        type: 'ACHIEVEMENT'
                    }
                });

                unlocked.push(achievement);
            }
        }

        return unlocked;
    }
};

module.exports = achievementService;
