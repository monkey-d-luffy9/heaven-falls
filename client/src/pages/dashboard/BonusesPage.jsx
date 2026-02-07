import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { bonusesAPI } from '../../services/api';
import CountdownTimer from '../../components/CountdownTimer';
import { Gift, Clock, Check, Crown, Flame, Sparkles } from 'lucide-react';
import './Dashboard.css';

export default function BonusesPage() {
    const { refreshUser } = useAuth();
    const [bonuses, setBonuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(null);
    const [result, setResult] = useState(null);

    useEffect(() => {
        loadBonuses();
    }, []);

    const loadBonuses = async () => {
        try {
            const data = await bonusesAPI.getAll();
            setBonuses(data);
        } catch (error) {
            console.error('Failed to load bonuses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = async (bonusId) => {
        setClaiming(bonusId);
        setResult(null);

        try {
            const data = await bonusesAPI.claim(bonusId);
            setResult({ success: true, ...data });
            await refreshUser();
            await loadBonuses();
        } catch (error) {
            setResult({ error: error.message });
        } finally {
            setClaiming(null);
        }
    };

    const getBonusIcon = (type) => {
        const bonusType = (type || '').toLowerCase();
        switch (bonusType) {
            case 'daily_login': return <Gift size={24} />;
            case 'weekly': return <Sparkles size={24} />;
            case 'streak': return <Flame size={24} />;
            default: return <Gift size={24} />;
        }
    };

    if (loading) {
        return (
            <div className="games-loading">
                <div className="spinner"></div>
                <p>Loading bonuses...</p>
            </div>
        );
    }

    return (
        <div className="bonuses-page">
            <div className="games-header">
                <h1>
                    <Gift size={28} />
                    Bonus Center
                </h1>
                <p>Claim your daily, weekly, and special bonuses!</p>
            </div>

            {result && (
                <div className={`game-result ${result.error ? 'error' : 'success'}`} style={{ marginBottom: '2rem' }}>
                    {result.error ? result.error : (
                        <>
                            <Check size={24} />
                            <div>
                                <span className="result-label">{result.bonusName} claimed!</span>
                                <span className="result-value">+{result.creditsEarned} Credits</span>
                                {result.vipBonus && <span className="vip-bonus">{result.vipBonus}</span>}
                            </div>
                        </>
                    )}
                </div>
            )}

            <div className="bonuses-grid">
                {bonuses.map(bonus => (
                    <div key={bonus.id} className={`bonus-card ${!bonus.isAvailable ? 'on-cooldown' : ''}`}>
                        <div className="bonus-header">
                            <div className={`bonus-icon ${(bonus.type || '').toLowerCase()}`}>
                                {getBonusIcon(bonus.type)}
                            </div>
                            <span className="bonus-type">{(bonus.type || '').replace('_', ' ')}</span>
                        </div>

                        <h3>{bonus.name}</h3>
                        <p>{bonus.description}</p>

                        <div className="bonus-rewards">
                            <div className="reward-item">
                                <Gift size={16} />
                                <span>{bonus.creditAmount} Credits</span>
                            </div>
                            {bonus.pointAmount > 0 && (
                                <div className="reward-item">
                                    <Crown size={16} />
                                    <span>{bonus.pointAmount} Points</span>
                                </div>
                            )}
                        </div>

                        {bonus.isAvailable ? (
                            <button
                                className="btn btn-gold btn-lg"
                                onClick={() => handleClaim(bonus.id)}
                                disabled={claiming === bonus.id}
                                style={{ width: '100%' }}
                            >
                                {claiming === bonus.id ? (
                                    <>
                                        <div className="spinner" style={{ width: 20, height: 20 }}></div>
                                        Claiming...
                                    </>
                                ) : (
                                    <>
                                        <Gift size={20} />
                                        Claim Now
                                    </>
                                )}
                            </button>
                        ) : (
                            <div className="cooldown-section">
                                <Clock size={16} />
                                <span>Available in:</span>
                                <CountdownTimer
                                    targetDate={bonus.nextAvailable}
                                    onComplete={loadBonuses}
                                />
                            </div>
                        )}

                        {bonus.streakDay && (
                            <div className="streak-requirement">
                                <Flame size={14} />
                                Requires {bonus.streakDay} day streak
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
