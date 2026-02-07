import { Link } from 'react-router-dom';
import { Gamepad2, Crown, Gift, Star } from 'lucide-react';
import './Games.css';

export default function GamesPublic() {
    const games = [
        {
            emoji: '🎡',
            name: 'Lucky Wheel',
            description: 'Spin the wheel and win amazing prizes! Land on different segments for various credit amounts.',
            features: ['Daily spins available', 'Up to 500 credits', 'VIP multipliers']
        },
        {
            emoji: '🥠',
            name: 'Fortune Cookie',
            description: 'Crack open a fortune cookie to reveal your prize. Tap three times to break it open!',
            features: ['Interactive gameplay', 'Instant rewards', 'VIP multipliers']
        },
        {
            emoji: '🎫',
            name: 'Scratch Card',
            description: 'Scratch off the coating to reveal hidden prizes. Just like real scratch cards!',
            features: ['Touch-friendly', 'Progressive reveal', 'VIP multipliers']
        }
    ];

    const platforms = [
        { name: 'Orion Stars', popular: true },
        { name: 'Game Vault', popular: true },
        { name: 'Panda Master', popular: false },
        { name: 'Ultra Panda', popular: true },
        { name: 'Fire Kirin', popular: false },
        { name: 'Juwa', popular: true }
    ];

    return (
        <div className="games-public-page">
            {/* Hero Section */}
            <section className="games-hero">
                <h1>
                    <Gamepad2 size={36} />
                    Bonus Games & Platforms
                </h1>
                <p>Play exciting games to earn free bonus credits every day</p>
            </section>

            {/* Bonus Games */}
            <section className="bonus-games-section">
                <h2>Interactive Bonus Games</h2>
                <p className="section-subtitle">Free games to earn extra credits</p>

                <div className="bonus-games-grid">
                    {games.map((game, index) => (
                        <div key={index} className="game-feature-card">
                            <span className="game-emoji-large">{game.emoji}</span>
                            <h3>{game.name}</h3>
                            <p>{game.description}</p>
                            <ul>
                                {game.features.map((feature, i) => (
                                    <li key={i}>
                                        <Star size={14} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="games-cta">
                    <p>Sign up now to start playing and winning!</p>
                    <Link to="/register" className="btn btn-gold btn-lg">
                        <Gift size={18} />
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Supported Platforms */}
            <section className="platforms-section">
                <h2>Supported Gaming Platforms</h2>
                <p className="section-subtitle">We support all major gaming platforms</p>

                <div className="platforms-grid">
                    {platforms.map((platform, index) => (
                        <div key={index} className={`platform-card ${platform.popular ? 'popular' : ''}`}>
                            <Gamepad2 size={24} />
                            <span>{platform.name}</span>
                            {platform.popular && <span className="popular-badge">Popular</span>}
                        </div>
                    ))}
                </div>
            </section>

            {/* VIP Benefits */}
            <section className="vip-benefits-section">
                <h2>
                    <Crown size={28} />
                    VIP Benefits for Games
                </h2>
                <p className="section-subtitle">Higher VIP tiers mean bigger rewards from games</p>

                <div className="benefits-grid">
                    <div className="benefit-card">
                        <div className="benefit-icon vip-bronze">
                            <Crown size={24} />
                        </div>
                        <h4>Bronze</h4>
                        <span className="multiplier">1x Bonus</span>
                        <p>Standard rewards on all games</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon vip-silver">
                            <Crown size={24} />
                        </div>
                        <h4>Silver</h4>
                        <span className="multiplier">1.25x Bonus</span>
                        <p>25% extra on all game winnings</p>
                    </div>
                    <div className="benefit-card">
                        <div className="benefit-icon vip-gold">
                            <Crown size={24} />
                        </div>
                        <h4>Gold</h4>
                        <span className="multiplier">1.5x Bonus</span>
                        <p>50% extra on all game winnings</p>
                    </div>
                    <div className="benefit-card featured">
                        <div className="benefit-icon vip-platinum">
                            <Crown size={24} />
                        </div>
                        <h4>Platinum</h4>
                        <span className="multiplier">2x Bonus</span>
                        <p>Double rewards on all games!</p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="games-final-cta">
                <h2>Ready to Start Playing?</h2>
                <p>Join now and get welcome bonus credits instantly</p>
                <div className="cta-buttons">
                    <Link to="/register" className="btn btn-gold btn-lg">Create Account</Link>
                    <Link to="/how-it-works" className="btn btn-secondary btn-lg">Learn More</Link>
                </div>
            </section>
        </div>
    );
}
