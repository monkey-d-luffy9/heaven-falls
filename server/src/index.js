const express = require('express');
const cors = require('cors');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/games');
const bonusRoutes = require('./routes/bonuses');
const userRoutes = require('./routes/user');
const notificationRoutes = require('./routes/notifications');
const adminRoutes = require('./routes/admin');

const app = express();

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:5001',
            process.env.FRONTEND_URL
        ];

        // Allow Vercel deployments
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/bonuses', bonusRoutes);
app.use('/api/user', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server only when not in Vercel serverless environment
if (!process.env.VERCEL) {
    app.listen(config.port, () => {
        console.log(`🎮 Loyalty Game Hub API running on port ${config.port}`);
        console.log(`📍 Environment: ${config.nodeEnv}`);
        console.log(`\n🔐 Default admin credentials:`);
        console.log(`   Username: admin`);
        console.log(`   Password: admin123`);
    });
}

// Export for Vercel
module.exports = app;
