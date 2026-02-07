require('dotenv').config();

const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database is handled by Prisma via DATABASE_URL env
  databaseUrl: process.env.DATABASE_URL,

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_in_production',
  jwtExpires: process.env.JWT_EXPIRES_IN || '7d',

  // Referral bonuses
  referrerBonus: parseFloat(process.env.REFERRER_BONUS) || 50,
  referredBonus: parseFloat(process.env.REFERRED_BONUS) || 25,
};

module.exports = config;
