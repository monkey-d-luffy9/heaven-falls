import { useState, useEffect } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import './GameComponents.css';

export default function CookieGame({ game, onPlay, result, playing, isAvailable }) {
    const [cracked, setCracked] = useState(false);
    const [crackLevel, setCrackLevel] = useState(0);
    const [shaking, setShaking] = useState(false);

    useEffect(() => {
        if (result && !result.error) {
            setCracked(true);
            setCrackLevel(3);
        }
    }, [result]);

    const handleClick = () => {
        if (!isAvailable || playing || cracked) return;

        if (crackLevel < 2) {
            setCrackLevel(prev => prev + 1);
            setShaking(true);
            setTimeout(() => setShaking(false), 300);
        } else {
            onPlay();
        }
    };

    const resetGame = () => {
        setCracked(false);
        setCrackLevel(0);
    };

    return (
        <div className="cookie-game">
            <h2>🥠 Fortune Cookie</h2>
            <p>Tap the cookie 3 times to reveal your fortune!</p>

            <div
                className={`cookie-container ${shaking ? 'shake' : ''} ${cracked ? 'cracked' : ''}`}
                onClick={handleClick}
            >
                <div className="cookie">
                    <div className="cookie-body">
                        <span className="cookie-emoji">🥠</span>
                        {crackLevel >= 1 && <div className="crack crack-1"></div>}
                        {crackLevel >= 2 && <div className="crack crack-2"></div>}
                    </div>

                    {cracked && result && result.reward !== undefined && !result.error && (
                        <div className="fortune-slip">
                            <Sparkles size={20} />
                            <span className="fortune-value">{result.reward.toFixed(2)}</span>
                            <span>Credits!</span>
                        </div>
                    )}
                </div>

                {!cracked && !playing && (
                    <div className="tap-indicator">
                        Tap! ({3 - crackLevel} left)
                    </div>
                )}

                {playing && (
                    <div className="tap-indicator">
                        <div className="spinner" style={{ width: 20, height: 20 }}></div>
                    </div>
                )}
            </div>

            {result && result.reward !== undefined && !result.error && (
                <div className="game-result success">
                    <Gift size={24} />
                    <div>
                        <span className="result-label">Fortune revealed!</span>
                        <span className="result-value">{result.reward.toFixed(2)} Credits</span>
                        {result.multiplier > 1 && (
                            <span className="vip-bonus">VIP Multiplier: {result.multiplier}x</span>
                        )}
                    </div>
                </div>
            )}

            {result?.error && (
                <div className="game-result error">
                    {result.error}
                </div>
            )}

            {!cracked && (
                <button
                    className="btn btn-gold btn-lg"
                    onClick={handleClick}
                    disabled={!isAvailable || playing}
                >
                    <Gift size={20} />
                    Break Cookie!
                </button>
            )}
        </div>
    );
}
