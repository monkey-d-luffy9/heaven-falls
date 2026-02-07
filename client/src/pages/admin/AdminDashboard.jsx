import { useOutletContext } from 'react-router-dom';
import { Users, Gamepad2, Gift, TrendingUp, Crown } from 'lucide-react';
import './Admin.css';

export default function AdminDashboard() {
    const { stats } = useOutletContext();

    if (!stats) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <h1>Dashboard</h1>
            <p>Overview of your loyalty hub</p>

            <div className="admin-stats-grid">
                <div className="admin-stat-card">
                    <h3>Total Users</h3>
                    <div className="value">{stats.totalUsers}</div>
                    <Users size={20} style={{ color: 'var(--primary)', marginTop: '0.5rem' }} />
                </div>

                <div className="admin-stat-card">
                    <h3>Active Users</h3>
                    <div className="value">{stats.activeUsers}</div>
                    <TrendingUp size={20} style={{ color: 'var(--success)', marginTop: '0.5rem' }} />
                </div>

                <div className="admin-stat-card highlight">
                    <h3>Credits Given Today</h3>
                    <div className="value">{stats.todayCreditsGiven.toFixed(2)}</div>
                    <Gift size={20} style={{ marginTop: '0.5rem' }} />
                </div>

                <div className="admin-stat-card">
                    <h3>Games Played Today</h3>
                    <div className="value">{stats.todayGamesPlayed}</div>
                    <Gamepad2 size={20} style={{ color: 'var(--secondary)', marginTop: '0.5rem' }} />
                </div>
            </div>

            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                <div className="admin-stat-card">
                    <h3>Total Credits in Circulation</h3>
                    <div className="value" style={{ color: 'var(--accent-gold)' }}>
                        {stats.totalCreditsInCirculation.toFixed(2)}
                    </div>
                </div>

                <div className="admin-stat-card">
                    <h3>Active Games</h3>
                    <div className="value">{stats.totalGames}</div>
                </div>

                <div className="admin-stat-card">
                    <h3>Active Bonuses</h3>
                    <div className="value">{stats.totalBonuses}</div>
                </div>
            </div>

            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>VIP Distribution</h2>
            <div className="admin-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
                {['Bronze', 'Silver', 'Gold', 'Platinum'].map(tier => (
                    <div key={tier} className="admin-stat-card">
                        <div className={`vip-badge vip-${tier.toLowerCase()}`} style={{ marginBottom: '0.5rem' }}>
                            <Crown size={14} />
                            {tier}
                        </div>
                        <div className="value">{stats.vipDistribution[tier] || 0}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
