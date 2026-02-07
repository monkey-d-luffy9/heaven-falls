-- Loyalty Game Hub Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    facebook_name VARCHAR(100),
    bonus_credits DECIMAL(10, 2) DEFAULT 0,
    loyalty_points INTEGER DEFAULT 0,
    vip_tier VARCHAR(20) DEFAULT 'Bronze',
    referral_code VARCHAR(20) UNIQUE,
    referred_by UUID REFERENCES users(id),
    login_streak INTEGER DEFAULT 0,
    last_login_date DATE,
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- VIP Tiers table
CREATE TABLE vip_tiers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(20) UNIQUE NOT NULL,
    points_required INTEGER NOT NULL,
    bonus_multiplier DECIMAL(3, 2) DEFAULT 1.00,
    special_perks JSONB,
    icon_color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default VIP tiers
INSERT INTO vip_tiers (name, points_required, bonus_multiplier, icon_color, special_perks) VALUES
('Bronze', 0, 1.00, '#CD7F32', '{"daily_bonus_boost": 0, "weekly_bonus_boost": 0}'),
('Silver', 500, 1.25, '#C0C0C0', '{"daily_bonus_boost": 10, "weekly_bonus_boost": 25}'),
('Gold', 2000, 1.50, '#FFD700', '{"daily_bonus_boost": 25, "weekly_bonus_boost": 50, "exclusive_games": true}'),
('Platinum', 5000, 2.00, '#E5E4E2', '{"daily_bonus_boost": 50, "weekly_bonus_boost": 100, "exclusive_games": true, "priority_support": true}');

-- Bonus Games table (wheel, scratch, cookie breaker, etc.)
CREATE TABLE bonus_games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    game_type VARCHAR(50) NOT NULL, -- 'wheel', 'scratch', 'cookie', 'slot'
    description TEXT,
    icon VARCHAR(50),
    min_bonus DECIMAL(10, 2) DEFAULT 0,
    max_bonus DECIMAL(10, 2) DEFAULT 100,
    bonus_options JSONB, -- For wheel: array of possible prizes
    cooldown_hours INTEGER DEFAULT 24,
    vip_tier_required VARCHAR(20) DEFAULT 'Bronze',
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default bonus games
INSERT INTO bonus_games (name, game_type, description, icon, min_bonus, max_bonus, cooldown_hours, bonus_options) VALUES
('Lucky Wheel', 'wheel', 'Spin the wheel to win amazing bonuses!', 'wheel', 5, 500, 24, 
 '[{"value": 5, "label": "5 Credits", "color": "#FF6B6B", "probability": 30},
   {"value": 10, "label": "10 Credits", "color": "#4ECDC4", "probability": 25},
   {"value": 25, "label": "25 Credits", "color": "#45B7D1", "probability": 20},
   {"value": 50, "label": "50 Credits", "color": "#96CEB4", "probability": 15},
   {"value": 100, "label": "100 Credits", "color": "#FFEAA7", "probability": 7},
   {"value": 500, "label": "JACKPOT!", "color": "#DDA0DD", "probability": 3}]'),
('Fortune Cookie', 'cookie', 'Break the cookie to reveal your bonus!', 'cookie', 10, 200, 24,
 '[{"value": 10, "probability": 35},
   {"value": 20, "probability": 30},
   {"value": 50, "probability": 20},
   {"value": 100, "probability": 10},
   {"value": 200, "probability": 5}]'),
('Scratch & Win', 'scratch', 'Scratch the card to uncover your prize!', 'ticket', 5, 300, 24,
 '[{"value": 5, "probability": 30},
   {"value": 15, "probability": 25},
   {"value": 30, "probability": 20},
   {"value": 75, "probability": 15},
   {"value": 150, "probability": 7},
   {"value": 300, "probability": 3}]');

-- User game plays (cooldown tracking)
CREATE TABLE user_game_plays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID REFERENCES bonus_games(id) ON DELETE CASCADE,
    credits_won DECIMAL(10, 2),
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_available_at TIMESTAMP,
    UNIQUE(user_id, game_id)
);

-- Special bonuses (daily login, weekly, events)
CREATE TABLE special_bonuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    bonus_type VARCHAR(50) NOT NULL, -- 'daily_login', 'weekly', 'event', 'streak'
    description TEXT,
    credit_amount DECIMAL(10, 2) DEFAULT 0,
    point_amount INTEGER DEFAULT 0,
    cooldown_hours INTEGER,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    vip_tier_required VARCHAR(20) DEFAULT 'Bronze',
    streak_day INTEGER, -- For streak bonuses
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default special bonuses
INSERT INTO special_bonuses (name, bonus_type, description, credit_amount, point_amount, cooldown_hours, streak_day) VALUES
('Daily Login Bonus', 'daily_login', 'Login every day to claim your free bonus!', 10, 5, 24, NULL),
('Weekly Mega Bonus', 'weekly', 'Claim your weekly mega bonus every 7 days!', 100, 50, 168, NULL),
('3-Day Streak', 'streak', 'Bonus for 3 days login streak', 25, 15, NULL, 3),
('7-Day Streak', 'streak', 'Bonus for 7 days login streak', 75, 40, NULL, 7),
('14-Day Streak', 'streak', 'Bonus for 14 days login streak', 200, 100, NULL, 14);

-- User special bonus claims
CREATE TABLE user_bonus_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bonus_id UUID REFERENCES special_bonuses(id) ON DELETE CASCADE,
    claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_available_at TIMESTAMP
);

-- Referrals table
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID REFERENCES users(id) ON DELETE CASCADE,
    referrer_bonus DECIMAL(10, 2) DEFAULT 50,
    referred_bonus DECIMAL(10, 2) DEFAULT 25,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transaction history
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL, -- 'game_win', 'bonus_claim', 'referral', 'admin_manual', 'redemption'
    credit_amount DECIMAL(10, 2) DEFAULT 0,
    point_amount INTEGER DEFAULT 0,
    description TEXT,
    admin_id UUID REFERENCES users(id),
    admin_note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements/Badges
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    requirement_type VARCHAR(50), -- 'referrals', 'games_played', 'streak', 'credits_won'
    requirement_value INTEGER,
    reward_credits DECIMAL(10, 2) DEFAULT 0,
    reward_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, requirement_type, requirement_value, reward_credits, reward_points) VALUES
('First Spin', 'Play your first bonus game', 'star', 'games_played', 1, 10, 5),
('Lucky 7', 'Play 7 bonus games', 'trophy', 'games_played', 7, 50, 25),
('Game Master', 'Play 50 bonus games', 'crown', 'games_played', 50, 200, 100),
('Networker', 'Refer your first friend', 'users', 'referrals', 1, 25, 15),
('Influencer', 'Refer 10 friends', 'share', 'referrals', 10, 250, 150),
('Dedicated', '7 day login streak', 'flame', 'streak', 7, 50, 30),
('Loyal Player', '30 day login streak', 'award', 'streak', 30, 300, 200);

-- User achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    message TEXT,
    notification_type VARCHAR(50), -- 'bonus', 'achievement', 'referral', 'system'
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_referral_code ON users(referral_code);
CREATE INDEX idx_users_vip_tier ON users(vip_tier);
CREATE INDEX idx_user_game_plays_user ON user_game_plays(user_id);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = FALSE;
