import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI } from '../../services/api';
import {
    Trophy,
    Crown,
    Star,
    Gift,
    Target,
    Award,
    Zap,
    TrendingUp,
    Lock
} from 'lucide-react';
import './Rewards.css';

export default function RewardsPage() {
    const { user } = useAuth();
    const [achievements, setAchievements] = useState([]);
    const [vipInfo, setVipInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRewardsData();
    }, []);

    const loadRewardsData = async () => {
        try {
            const [achievementsData, vipData] = await Promise.all([
                userAPI.getAchievements(),
                userAPI.getVIP()
            ]);
            setAchievements(achievementsData.achievements || []);
            setVipInfo(vipData);
        } catch (error) {
            console.error('Failed to load rewards data:', error);
        } finally {
            setLoading(false);
        }
    };

    const vipTiers = [
        {
            name: 'Bronze',
            pointsRequired: 0,
            multiplier: 1,
            benefits: ['Access to all games', 'Daily bonus', 'Basic support']
        },
        {
            name: 'Silver',
            pointsRequired: 500,
            multiplier: 1.25,
            benefits: ['1.25x bonus multiplier', 'Weekly mega bonus', 'Priority support']
        },
        {
            name: 'Gold',
            pointsRequired: 2000,
            multiplier: 1.5,
            benefits: ['1.5x bonus multiplier', 'Exclusive games', 'Personal manager']
        },
        {
            name: 'Platinum',
            pointsRequired: 5000,
            multiplier: 2,
            benefits: ['2x bonus multiplier', 'VIP events', 'Instant withdrawals']
        }
    ];

    // Find current tier with case-insensitive matching, default to Bronze (index 0)
    let currentTierIndex = vipTiers.findIndex(t => t.name.toLowerCase() === (user?.vipTier?.toLowerCase() || 'bronze'));
    if (currentTierIndex === -1) currentTierIndex = 0;
    const currentTier = vipTiers[currentTierIndex] || vipTiers[0];
    const nextTier = vipTiers[currentTierIndex + 1];

    const getProgress = () => {
        if (!nextTier) return 100;
        const currentPoints = user?.loyaltyPoints || 0;
        const currentReq = currentTier.pointsRequired;
        const nextReq = nextTier.pointsRequired;
        return ((currentPoints - currentReq) / (nextReq - currentReq)) * 100;
    };

    const getAchievementIcon = (type) => {
        switch (type) {
            case 'games': return <Zap size={24} />;
            case 'streak': return <Target size={24} />;
            case 'referral': return <TrendingUp size={24} />;
            default: return <Award size={24} />;
        }
    };

    if (loading) {
        return (
            <div className="rewards-loading">
                <div className="spinner"></div>
                <p>Loading rewards...</p>
            </div>
        );
    }

    return (
        <div className="rewards-page">
            <h1>
                <Trophy size={28} />
                Rewards & Loyalty
            </h1>

            {/* VIP Status Card */}
            <div className="vip-status-card">
                <div className="vip-info">
                    <div className={`vip-icon vip-${user?.vipTier?.toLowerCase()}`}>
                        <Crown size={32} />
                    </div>
                    <div className="vip-details">
                        <span className="vip-level">{user?.vipTier} Member</span>
                        <span className="vip-points">{user?.loyaltyPoints} Loyalty Points</span>
                    </div>
                </div>

                {nextTier && (
                    <div className="vip-progress-section">
                        <div className="progress-header">
                            <span>Progress to {nextTier.name}</span>
                            <span>{nextTier.pointsRequired - (user?.loyaltyPoints || 0)} points needed</span>
                        </div>
                        <div className="progress-bar large">
                            <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
                        </div>
                    </div>
                )}

                <div className="current-benefits">
                    <h4>Your Benefits</h4>
                    <ul>
                        {currentTier.benefits.map((benefit, i) => (
                            <li key={i}>
                                <Star size={14} />
                                {benefit}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* VIP Tiers */}
            <div className="section">
                <h2>VIP Tiers</h2>
                <div className="tiers-grid">
                    {vipTiers.map((tier, index) => {
                        const isCurrentTier = tier.name === user?.vipTier;
                        const isUnlocked = index <= currentTierIndex;

                        return (
                            <div
                                key={tier.name}
                                className={`tier-card ${isCurrentTier ? 'current' : ''} ${!isUnlocked ? 'locked' : ''}`}
                            >
                                <div className={`tier-icon vip-${tier.name.toLowerCase()}`}>
                                    {isUnlocked ? <Crown size={28} /> : <Lock size={28} />}
                                </div>
                                <h3>{tier.name}</h3>
                                <span className="tier-points">{tier.pointsRequired} points</span>
                                <div className="tier-multiplier">
                                    <Gift size={16} />
                                    {tier.multiplier}x Bonus
                                </div>
                                <ul className="tier-benefits">
                                    {tier.benefits.map((benefit, i) => (
                                        <li key={i}>{benefit}</li>
                                    ))}
                                </ul>
                                {isCurrentTier && <span className="current-badge">Current</span>}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Achievements */}
            <div className="section">
                <h2>Achievements</h2>
                <div className="achievements-grid">
                    {achievements.length > 0 ? (
                        achievements.map(achievement => (
                            <div
                                key={achievement.id}
                                className={`achievement-card ${achievement.isUnlocked ? 'unlocked' : 'locked'}`}
                            >
                                <div className={`achievement-icon ${achievement.isUnlocked ? 'completed' : ''}`}>
                                    {getAchievementIcon(achievement.achievementType)}
                                </div>
                                <h4>{achievement.name}</h4>
                                <p>{achievement.description}</p>
                                {achievement.isUnlocked ? (
                                    <div className="achievement-reward earned">
                                        <Gift size={14} />
                                        {achievement.rewardCredits} Credits Earned
                                    </div>
                                ) : (
                                    <div className="achievement-reward">
                                        <Gift size={14} />
                                        {achievement.rewardCredits} Credits
                                    </div>
                                )}
                                {!achievement.isUnlocked && achievement.progress !== undefined && (
                                    <div className="achievement-progress">
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${(achievement.progress / achievement.requirement) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span>{achievement.progress}/{achievement.requirement}</span>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-achievements">
                            <Award size={48} />
                            <p>Start playing to unlock achievements!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* How to Earn Points */}
            <div className="section">
                <h2>How to Earn Points</h2>
                <div className="earn-points-grid">
                    <div className="earn-card">
                        <Zap size={32} />
                        <h4>Play Games</h4>
                        <p>Earn 10 points per game played</p>
                    </div>
                    <div className="earn-card">
                        <Gift size={32} />
                        <h4>Claim Bonuses</h4>
                        <p>Get bonus points with every claim</p>
                    </div>
                    <div className="earn-card">
                        <TrendingUp size={32} />
                        <h4>Refer Friends</h4>
                        <p>50 points per successful referral</p>
                    </div>
                    <div className="earn-card">
                        <Target size={32} />
                        <h4>Maintain Streaks</h4>
                        <p>Bonus points for login streaks</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
