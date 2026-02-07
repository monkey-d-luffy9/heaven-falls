import { Link } from 'react-router-dom';
import {
    Gamepad2,
    Gift,
    Trophy,
    Users,
    Star,
    ArrowRight,
    Sparkles,
    Shield,
    Zap
} from 'lucide-react';
import './Home.css';

export default function Home() {
    const features = [
        {
            icon: <Gift size={32} />,
            title: 'Daily Bonuses',
            description: 'Claim free bonus credits every day just for logging in!'
        },
        {
            icon: <Gamepad2 size={32} />,
            title: 'Fun Games',
            description: 'Spin the wheel, scratch cards, and break cookies to win!'
        },
        {
            icon: <Trophy size={32} />,
            title: 'VIP Rewards',
            description: 'Level up your VIP status for bigger multipliers!'
        },
        {
            icon: <Users size={32} />,
            title: 'Referral Bonus',
            description: 'Invite friends and both of you earn bonus credits!'
        }
    ];

    const games = [
        {
            name: 'Lucky Wheel',
            description: 'Spin to win up to 500 credits!',
            icon: '🎡',
            color: '#FF6B6B'
        },
        {
            name: 'Fortune Cookie',
            description: 'Break the cookie for your fortune!',
            icon: '🥠',
            color: '#4ECDC4'
        },
        {
            name: 'Scratch & Win',
            description: 'Scratch to reveal your prize!',
            icon: '🎫',
            color: '#45B7D1'
        }
    ];

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-glow"></div>
                </div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>Welcome to the Game Hub</span>
                    </div>
                    <h1 className="hero-title">
                        Play Games. <span className="text-gradient">Earn Rewards.</span>
                    </h1>
                    <p className="hero-subtitle">
                        Your ultimate destination for bonus credits, exciting games, and amazing rewards.
                        Join thousands of players winning big every day!
                    </p>
                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-primary btn-lg">
                            Get Started Free
                            <ArrowRight size={20} />
                        </Link>
                        <Link to="/games" className="btn btn-secondary btn-lg">
                            View Games
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-value">10K+</span>
                            <span className="stat-label">Active Players</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">$50K+</span>
                            <span className="stat-label">Credits Given</span>
                        </div>
                        <div className="stat">
                            <span className="stat-value">24/7</span>
                            <span className="stat-label">Support</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="container">
                    <h2 className="section-title">Why Choose Us?</h2>
                    <p className="section-subtitle">
                        Everything you need to maximize your rewards
                    </p>
                    <div className="features-grid">
                        {features.map((feature, index) => (
                            <div key={index} className="feature-card">
                                <div className="feature-icon">{feature.icon}</div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Games Preview Section */}
            <section className="games-preview">
                <div className="container">
                    <h2 className="section-title">Exciting Games</h2>
                    <p className="section-subtitle">
                        Play fun mini-games to win bonus credits
                    </p>
                    <div className="games-grid">
                        {games.map((game, index) => (
                            <div key={index} className="game-preview-card" style={{ '--accent': game.color }}>
                                <div className="game-icon">{game.icon}</div>
                                <h3>{game.name}</h3>
                                <p>{game.description}</p>
                                <Link to="/login" className="btn btn-primary btn-sm">
                                    Play Now
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="trust">
                <div className="container">
                    <div className="trust-content">
                        <div className="trust-text">
                            <h2>Trusted & Secure</h2>
                            <p>
                                We prioritize your security and provide transparent bonus systems.
                                All credits are yours to keep and use across our partner platforms.
                            </p>
                            <div className="trust-badges">
                                <div className="trust-badge">
                                    <Shield size={24} />
                                    <span>Secure Platform</span>
                                </div>
                                <div className="trust-badge">
                                    <Zap size={24} />
                                    <span>Instant Rewards</span>
                                </div>
                                <div className="trust-badge">
                                    <Star size={24} />
                                    <span>Top Rated</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta">
                <div className="container">
                    <div className="cta-card">
                        <h2>Ready to Start Winning?</h2>
                        <p>Create your free account and claim your first bonus today!</p>
                        <Link to="/register" className="btn btn-gold btn-lg">
                            Sign Up Now
                            <Gift size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-brand">
                            <Gamepad2 size={32} />
                            <span>Loyalty Hub</span>
                        </div>
                        <div className="footer-links">
                            <Link to="/how-it-works">How It Works</Link>
                            <Link to="/support">Support</Link>
                            <Link to="/games">Games</Link>
                        </div>
                        <p className="footer-copy">
                            © 2024 Loyalty Hub. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
