import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { gamesAPI, bonusesAPI, notificationsAPI } from '../../services/api';
import CountdownTimer from '../../components/CountdownTimer';
import {
    Gift,
    Gamepad2,
    Trophy,
    Bell,
    TrendingUp,
    Clock,
    Crown,
    Flame,
    ArrowRight
} from 'lucide-react';
import './Dashboard.css';

export default function DashboardHome() {
    const { user, refreshUser } = useAuth();
    const [games, setGames] = useState([]);
    const [bonuses, setBonuses] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [gamesStatus, bonusesData, notificationsData] = await Promise.all([
                gamesAPI.getStatus(),
                bonusesAPI.getAll(),
                notificationsAPI.getAll()
            ]);
            setGames(gamesStatus);
            setBonuses(bonusesData);
            setNotifications(notificationsData.notifications.filter(n => !n.isRead).slice(0, 5));
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const availableGames = games.filter(g => g.isAvailable).length;
    const availableBonuses = bonuses.filter(b => b.isAvailable).length;

    const getVipProgress = () => {
        const tiers = [
            { name: 'Bronze', points: 0 },
            { name: 'Silver', points: 500 },
            { name: 'Gold', points: 2000 },
            { name: 'Platinum', points: 5000 }
        ];

        // Find current tier with case-insensitive matching, default to Bronze (index 0)
        let currentIndex = tiers.findIndex(t => t.name.toLowerCase() === (user?.vipTier?.toLowerCase() || 'bronze'));
        if (currentIndex === -1) currentIndex = 0;

        const nextTier = tiers[currentIndex + 1];

        if (!nextTier) return { progress: 100, nextTier: null, pointsNeeded: 0 };

        const currentPoints = user?.loyaltyPoints || 0;
        const currentTierPoints = tiers[currentIndex].points;
        const progress = ((currentPoints - currentTierPoints) / (nextTier.points - currentTierPoints)) * 100;

        return {
            progress: Math.min(100, Math.max(0, progress)),
            nextTier: nextTier.name,
            pointsNeeded: nextTier.points - currentPoints
        };
    };

    const vipProgress = getVipProgress();

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Loading your rewards...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-home">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-text">
                    <h1>Welcome back, <span className="text-gradient">{user?.username}</span>!</h1>
                    <p>Check out what's waiting for you today</p>
                </div>
                <div className="streak-badge">
                    <Flame size={24} />
                    <div>
                        <span className="streak-count">{user?.loginStreak || 0}</span>
                        <span className="streak-label">Day Streak</span>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card credits">
                    <div className="stat-icon">
                        <Gift size={28} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{user?.bonusCredits?.toFixed(2) || '0.00'}</span>
                        <span className="stat-label">Bonus Credits</span>
                    </div>
                </div>

                <div className="stat-card points">
                    <div className="stat-icon">
                        <Trophy size={28} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{user?.loyaltyPoints || 0}</span>
                        <span className="stat-label">Loyalty Points</span>
                    </div>
                </div>

                <div className="stat-card games">
                    <div className="stat-icon">
                        <Gamepad2 size={28} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{availableGames}</span>
                        <span className="stat-label">Games Ready</span>
                    </div>
                </div>

                <div className="stat-card bonuses">
                    <div className="stat-icon">
                        <Clock size={28} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{availableBonuses}</span>
                        <span className="stat-label">Bonuses Available</span>
                    </div>
                </div>
            </div>

            {/* VIP Progress */}
            <div className="vip-progress-card">
                <div className="vip-header">
                    <div className={`vip-badge vip-${user?.vipTier?.toLowerCase() || 'bronze'}`}>
                        <Crown size={18} />
                        {user?.vipTier || 'Bronze'}
                    </div>
                    {vipProgress.nextTier && (
                        <span className="vip-next">
                            {vipProgress.pointsNeeded} points to {vipProgress.nextTier}
                        </span>
                    )}
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${vipProgress.progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <h2>Quick Actions</h2>
                <div className="actions-grid">
                    <Link to="/dashboard/games" className="action-card play-games">
                        <Gamepad2 size={32} />
                        <span>Play Games</span>
                        {availableGames > 0 && <span className="action-badge">{availableGames}</span>}
                    </Link>
                    <Link to="/dashboard/bonuses" className="action-card claim-bonus">
                        <Gift size={32} />
                        <span>Claim Bonuses</span>
                        {availableBonuses > 0 && <span className="action-badge">{availableBonuses}</span>}
                    </Link>
                    <Link to="/dashboard/rewards" className="action-card view-rewards">
                        <Trophy size={32} />
                        <span>View Rewards</span>
                    </Link>
                </div>
            </div>

            {/* Available Games Preview */}
            {games.length > 0 && (
                <div className="section">
                    <div className="section-header">
                        <h2>Bonus Games</h2>
                        <Link to="/dashboard/games" className="see-all">
                            See All <ArrowRight size={16} />
                        </Link>
                    </div>
                    <div className="games-preview-grid">
                        {games.slice(0, 3).map(game => (
                            <div key={game.gameId} className={`game-card ${!game.isAvailable ? 'on-cooldown' : ''}`}>
                                <div className="game-icon-wrapper">
                                    {(game.type || '').toLowerCase() === 'wheel' && '🎡'}
                                    {(game.type || '').toLowerCase() === 'cookie' && '🥠'}
                                    {(game.type || '').toLowerCase() === 'scratch' && '🎫'}
                                </div>
                                <h3>{game.name}</h3>
                                {game.isAvailable ? (
                                    <Link to="/dashboard/games" className="btn btn-primary btn-sm">
                                        Play Now
                                    </Link>
                                ) : (
                                    <div className="cooldown-timer">
                                        <Clock size={14} />
                                        <CountdownTimer
                                            targetDate={game.nextAvailable}
                                            onComplete={loadDashboardData}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notifications */}
            {notifications.length > 0 && (
                <div className="section">
                    <div className="section-header">
                        <h2>Recent Notifications</h2>
                        <Bell size={20} />
                    </div>
                    <div className="notifications-list">
                        {notifications.map(notification => (
                            <div key={notification.id} className="notification-item">
                                <div className={`notification-icon ${notification.notificationType}`}>
                                    {notification.notificationType === 'bonus' && <Gift size={18} />}
                                    {notification.notificationType === 'achievement' && <Trophy size={18} />}
                                    {notification.notificationType === 'referral' && <TrendingUp size={18} />}
                                    {notification.notificationType === 'system' && <Bell size={18} />}
                                </div>
                                <div className="notification-content">
                                    <h4>{notification.title}</h4>
                                    <p>{notification.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
