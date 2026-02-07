import { Gift, Gamepad2, Crown, TrendingUp, Clock, Users, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './HowItWorks.css';

export default function HowItWorks() {
    const steps = [
        {
            icon: <Users size={32} />,
            title: 'Create Your Account',
            description: 'Sign up for free and get instant welcome bonus credits to start playing right away.'
        },
        {
            icon: <Gamepad2 size={32} />,
            title: 'Play Bonus Games',
            description: 'Spin the wheel, crack cookies, or scratch cards to win additional bonus credits every day.'
        },
        {
            icon: <Gift size={32} />,
            title: 'Claim Daily Bonuses',
            description: 'Log in daily to claim your free bonuses. Maintain streaks for even bigger rewards!'
        },
        {
            icon: <Crown size={32} />,
            title: 'Level Up Your VIP',
            description: 'Earn loyalty points and climb the VIP tiers for multiplied bonuses and exclusive perks.'
        },
        {
            icon: <TrendingUp size={32} />,
            title: 'Invite Friends',
            description: 'Share your referral code and earn credits when friends join and play.'
        }
    ];

    const bonusTypes = [
        {
            title: 'Daily Login Bonus',
            description: 'Free credits just for logging in every day',
            cooldown: 'Every 24 hours',
            amount: '10-50 credits'
        },
        {
            title: 'Weekly Mega Bonus',
            description: 'Bigger bonus available once per week',
            cooldown: 'Every 7 days',
            amount: '50-200 credits'
        },
        {
            title: 'Streak Rewards',
            description: 'Bonus multipliers for consecutive daily logins',
            cooldown: 'Continuous',
            amount: '1.5x - 3x multiplier'
        },
        {
            title: 'Referral Bonus',
            description: 'Credits for each friend you invite',
            cooldown: 'Per referral',
            amount: '50 credits'
        }
    ];

    const vipTiers = [
        { name: 'Bronze', points: '0-499', multiplier: '1x', color: '#CD7F32' },
        { name: 'Silver', points: '500-1,999', multiplier: '1.25x', color: '#C0C0C0' },
        { name: 'Gold', points: '2,000-4,999', multiplier: '1.5x', color: '#FFD700' },
        { name: 'Platinum', points: '5,000+', multiplier: '2x', color: '#E5E4E2' }
    ];

    return (
        <div className="how-it-works-page">
            {/* Hero Section */}
            <section className="hiw-hero">
                <h1>How Our Bonus System Works</h1>
                <p>Earn free credits every day through games, bonuses, and referrals</p>
            </section>

            {/* Steps Section */}
            <section className="hiw-steps">
                <h2>Getting Started</h2>
                <div className="steps-container">
                    {steps.map((step, index) => (
                        <div key={index} className="step-card">
                            <div className="step-number">{index + 1}</div>
                            <div className="step-icon">{step.icon}</div>
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bonus Types Section */}
            <section className="hiw-bonuses">
                <h2>Types of Bonuses</h2>
                <div className="bonus-types-grid">
                    {bonusTypes.map((bonus, index) => (
                        <div key={index} className="bonus-type-card">
                            <h3>{bonus.title}</h3>
                            <p>{bonus.description}</p>
                            <div className="bonus-details">
                                <div className="detail">
                                    <Clock size={16} />
                                    <span>{bonus.cooldown}</span>
                                </div>
                                <div className="detail amount">
                                    <Gift size={16} />
                                    <span>{bonus.amount}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Games Section */}
            <section className="hiw-games">
                <h2>Bonus Games</h2>
                <div className="games-showcase">
                    <div className="game-showcase-card">
                        <span className="game-emoji">🎡</span>
                        <h3>Lucky Wheel</h3>
                        <p>Spin the wheel and land on exciting prizes. Multiple segments with different credit amounts!</p>
                        <ul>
                            <li><Check size={14} /> Daily spins available</li>
                            <li><Check size={14} /> Win up to 500 credits</li>
                            <li><Check size={14} /> VIP bonus multipliers</li>
                        </ul>
                    </div>
                    <div className="game-showcase-card">
                        <span className="game-emoji">🥠</span>
                        <h3>Fortune Cookie</h3>
                        <p>Crack open a fortune cookie to reveal your prize. Tap three times to break it!</p>
                        <ul>
                            <li><Check size={14} /> Fun interactive gameplay</li>
                            <li><Check size={14} /> Instant credit reveal</li>
                            <li><Check size={14} /> VIP bonus multipliers</li>
                        </ul>
                    </div>
                    <div className="game-showcase-card">
                        <span className="game-emoji">🎫</span>
                        <h3>Scratch Card</h3>
                        <p>Scratch off the coating to reveal your hidden prize. Just like real scratch cards!</p>
                        <ul>
                            <li><Check size={14} /> Touch-friendly scratching</li>
                            <li><Check size={14} /> Progressive reveal</li>
                            <li><Check size={14} /> VIP bonus multipliers</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* VIP Section */}
            <section className="hiw-vip">
                <h2>VIP Tiers & Benefits</h2>
                <p className="section-subtitle">Earn loyalty points to unlock higher tiers and bigger bonuses</p>
                <div className="vip-tiers-showcase">
                    {vipTiers.map((tier, index) => (
                        <div key={index} className="vip-tier-card" style={{ borderColor: tier.color }}>
                            <div className="tier-crown" style={{ background: tier.color }}>
                                <Crown size={24} />
                            </div>
                            <h3>{tier.name}</h3>
                            <div className="tier-info">
                                <span className="tier-points">{tier.points} points</span>
                                <span className="tier-multiplier">{tier.multiplier} bonus</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ Section */}
            <section className="hiw-faq">
                <h2>Frequently Asked Questions</h2>
                <div className="faq-list">
                    <div className="faq-item">
                        <h4>How do I earn bonus credits?</h4>
                        <p>You can earn credits by playing bonus games, claiming daily/weekly bonuses, maintaining login streaks, and referring friends.</p>
                    </div>
                    <div className="faq-item">
                        <h4>What are loyalty points?</h4>
                        <p>Loyalty points are earned by playing games and claiming bonuses. They determine your VIP tier and bonus multiplier.</p>
                    </div>
                    <div className="faq-item">
                        <h4>How do cooldowns work?</h4>
                        <p>Each bonus and game has a cooldown period. After claiming or playing, you'll need to wait before you can claim again.</p>
                    </div>
                    <div className="faq-item">
                        <h4>What are VIP multipliers?</h4>
                        <p>Higher VIP tiers give you bonus multipliers. For example, Gold tier gets 1.5x all bonuses automatically!</p>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="hiw-cta">
                <h2>Ready to Start Earning?</h2>
                <p>Join thousands of players earning free credits every day</p>
                <Link to="/register" className="btn btn-gold btn-lg">
                    Create Free Account
                </Link>
            </section>
        </div>
    );
}
