const prisma = require('../lib/prisma');

const notificationService = {
    // Get user notifications
    async findByUser(userId, options = {}) {
        const { unreadOnly = false, limit = 50 } = options;

        const where = { userId };
        if (unreadOnly) {
            where.isRead = false;
        }

        return prisma.notification.findMany({
            where,
            take: limit,
            orderBy: { createdAt: 'desc' }
        });
    },

    // Get unread count
    async getUnreadCount(userId) {
        return prisma.notification.count({
            where: { userId, isRead: false }
        });
    },

    // Mark as read
    async markAsRead(id, userId) {
        return prisma.notification.update({
            where: { id, userId },
            data: { isRead: true }
        });
    },

    // Mark all as read
    async markAllAsRead(userId) {
        return prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true }
        });
    },

    // Create notification
    async create(data) {
        return prisma.notification.create({
            data: {
                userId: data.userId,
                title: data.title,
                message: data.message,
                type: data.type || 'SYSTEM'
            }
        });
    }
};

module.exports = notificationService;
