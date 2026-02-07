import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { userAPI, authAPI } from '../../services/api';
import {
    User,
    Mail,
    Copy,
    Check,
    Crown,
    Calendar,
    Gift,
    TrendingUp,
    History,
    Share2
} from 'lucide-react';
import './Profile.css';

export default function ProfilePage() {
    const { user, refreshUser } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [referrals, setReferrals] = useState({ referrals: [], totalEarned: 0 });
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        currentPassword: '',
        newPassword: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        loadProfileData();
    }, []);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, email: user.email || '' }));
        }
    }, [user]);

    const loadProfileData = async () => {
        try {
            const [transactionsData, referralsData] = await Promise.all([
                userAPI.getTransactions({ limit: 10 }),
                userAPI.getReferrals()
            ]);
            setTransactions(transactionsData.transactions || []);
            setReferrals(referralsData);
        } catch (error) {
            console.error('Failed to load profile data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyReferralCode = () => {
        navigator.clipboard.writeText(user?.referralCode || '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyReferralLink = () => {
        const link = `${window.location.origin}/register?ref=${user?.referralCode}`;
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        try {
            await authAPI.updateProfile({
                email: formData.email,
                ...(formData.newPassword && {
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setEditing(false);
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '' }));
            refreshUser();
        } catch (error) {
            setMessage({ type: 'error', text: error.message });
        }
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'game_win': return <Gift size={18} />;
            case 'bonus_claim': return <TrendingUp size={18} />;
            case 'referral': return <Share2 size={18} />;
            default: return <History size={18} />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="profile-loading">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <h1>
                <User size={28} />
                My Profile
            </h1>

            <div className="profile-grid">
                {/* User Info Card */}
                <div className="profile-card user-info">
                    <div className="user-avatar">
                        <span>{user?.username?.charAt(0).toUpperCase()}</span>
                    </div>
                    <h2>{user?.username}</h2>
                    <div className={`vip-badge vip-${user?.vipTier?.toLowerCase()}`}>
                        <Crown size={14} />
                        {user?.vipTier} Member
                    </div>

                    <div className="user-stats">
                        <div className="user-stat">
                            <span className="stat-value">{user?.bonusCredits?.toFixed(2)}</span>
                            <span className="stat-label">Credits</span>
                        </div>
                        <div className="user-stat">
                            <span className="stat-value">{user?.loyaltyPoints}</span>
                            <span className="stat-label">Points</span>
                        </div>
                        <div className="user-stat">
                            <span className="stat-value">{user?.gamesPlayed || 0}</span>
                            <span className="stat-label">Games</span>
                        </div>
                    </div>

                    <div className="joined-date">
                        <Calendar size={14} />
                        Joined {user?.createdAt ? formatDate(user.createdAt) : 'Recently'}
                    </div>
                </div>

                {/* Account Settings */}
                <div className="profile-card settings">
                    <h3>Account Settings</h3>

                    {message.text && (
                        <div className={`profile-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    {editing ? (
                        <form onSubmit={handleUpdateProfile}>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={formData.currentPassword}
                                    onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                                    placeholder="Required to change password"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={formData.newPassword}
                                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                    placeholder="Leave blank to keep current"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="settings-view">
                            <div className="setting-item">
                                <span className="setting-label">
                                    <User size={16} /> Username
                                </span>
                                <span className="setting-value">{user?.username}</span>
                            </div>
                            <div className="setting-item">
                                <span className="setting-label">
                                    <Mail size={16} /> Email
                                </span>
                                <span className="setting-value">{user?.email || 'Not set'}</span>
                            </div>
                            <button className="btn btn-secondary" onClick={() => setEditing(true)}>
                                Edit Profile
                            </button>
                        </div>
                    )}
                </div>

                {/* Referral Card */}
                <div className="profile-card referral">
                    <h3>
                        <Share2 size={20} />
                        Referral Program
                    </h3>
                    <p>Invite friends and earn bonus credits!</p>

                    <div className="referral-code-box">
                        <label>Your Referral Code</label>
                        <div className="code-copy">
                            <span className="code">{user?.referralCode}</span>
                            <button onClick={copyReferralCode} className="copy-btn">
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    <button className="btn btn-gold" onClick={copyReferralLink}>
                        <Share2 size={18} />
                        Copy Referral Link
                    </button>

                    <div className="referral-stats">
                        <div className="referral-stat">
                            <span className="value">{referrals.referrals?.length || 0}</span>
                            <span className="label">Friends Invited</span>
                        </div>
                        <div className="referral-stat">
                            <span className="value">{referrals.totalEarned?.toFixed(2) || 0}</span>
                            <span className="label">Credits Earned</span>
                        </div>
                    </div>
                </div>

                {/* Transaction History */}
                <div className="profile-card transactions">
                    <h3>
                        <History size={20} />
                        Recent Activity
                    </h3>

                    {transactions.length > 0 ? (
                        <div className="transaction-list">
                            {transactions.map(tx => (
                                <div key={tx.id} className="transaction-item">
                                    <div className={`tx-icon ${tx.transactionType}`}>
                                        {getTransactionIcon(tx.transactionType)}
                                    </div>
                                    <div className="tx-details">
                                        <span className="tx-desc">{tx.description}</span>
                                        <span className="tx-date">{formatDate(tx.createdAt)}</span>
                                    </div>
                                    <div className={`tx-amount ${tx.creditChange >= 0 ? 'positive' : 'negative'}`}>
                                        {tx.creditChange >= 0 ? '+' : ''}{tx.creditChange.toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-transactions">
                            <History size={32} />
                            <p>No recent activity</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
