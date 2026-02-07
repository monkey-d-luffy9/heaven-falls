import { useState, useRef, useEffect } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import './GameComponents.css';

export default function WheelGame({ game, onPlay, onClose, result, playing, isAvailable }) {
    const [rotation, setRotation] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const wheelRef = useRef(null);

    // Parse segments from game.rewardSegments JSON or use default
    const defaultSegments = [
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 25, label: '25' },
        { value: 0, label: 'Try Again' },
        { value: 50, label: '50' },
        { value: 100, label: '100' }
    ];

    let segments = defaultSegments;
    try {
        if (game.rewardSegments) {
            const parsed = JSON.parse(game.rewardSegments);
            segments = parsed.map((seg, i) => ({
                value: seg.value,
                label: seg.label || String(seg.value)
            }));
        } else if (result?.segments) {
            segments = result.segments.map(seg => ({
                value: seg.value,
                label: seg.label || String(seg.value)
            }));
        }
    } catch (e) { }

    // Assign colors to segments
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#FF9F43', '#A29BFE'];
    segments = segments.map((seg, i) => ({ ...seg, color: colors[i % colors.length] }));

    useEffect(() => {
        // Backend returns { game, reward, multiplier, segmentIndex, rewardLabel }
        if (result && result.reward !== undefined && !result.error) {
            // Use the actual segment index from backend
            const segmentIndex = result.segmentIndex !== undefined
                ? result.segmentIndex
                : Math.floor(Math.random() * segments.length);

            const segmentAngle = 360 / segments.length;

            // Calculate target rotation (multiple full spins + landing position)
            const fullSpins = 5 + Math.floor(Math.random() * 3);
            const targetAngle = segmentIndex * segmentAngle + segmentAngle / 2;
            const newRotation = rotation + (fullSpins * 360) + (360 - targetAngle);

            setRotation(newRotation);
            setIsSpinning(true);

            setTimeout(() => {
                setIsSpinning(false);
            }, 5000);
        }
    }, [result]);

    const handleSpin = () => {
        if (!isAvailable || isSpinning || playing) return;
        onPlay();
    };

    const renderWheel = () => {
        const segmentAngle = 360 / segments.length;

        return segments.map((segment, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = startAngle + segmentAngle;

            const startRad = (startAngle - 90) * Math.PI / 180;
            const endRad = (endAngle - 90) * Math.PI / 180;

            const x1 = 150 + 140 * Math.cos(startRad);
            const y1 = 150 + 140 * Math.sin(startRad);
            const x2 = 150 + 140 * Math.cos(endRad);
            const y2 = 150 + 140 * Math.sin(endRad);

            const largeArc = segmentAngle > 180 ? 1 : 0;

            const pathD = `M 150 150 L ${x1} ${y1} A 140 140 0 ${largeArc} 1 ${x2} ${y2} Z`;

            const labelAngle = startAngle + segmentAngle / 2 - 90;
            const labelRad = labelAngle * Math.PI / 180;
            const labelX = 150 + 90 * Math.cos(labelRad);
            const labelY = 150 + 90 * Math.sin(labelRad);

            return (
                <g key={index}>
                    <path d={pathD} fill={segment.color} stroke="#fff" strokeWidth="2" />
                    <text
                        x={labelX}
                        y={labelY}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#000"
                        fontSize="16"
                        fontWeight="bold"
                        transform={`rotate(${startAngle + segmentAngle / 2}, ${labelX}, ${labelY})`}
                    >
                        {segment.label || segment.value}
                    </text>
                </g>
            );
        });
    };

    return (
        <div className="wheel-game">
            <h2>🎡 Lucky Wheel</h2>
            <p>Spin the wheel to win bonus credits!</p>

            <div className="wheel-container">
                <div className="wheel-pointer">▼</div>
                <svg
                    ref={wheelRef}
                    className="wheel"
                    width="300"
                    height="300"
                    viewBox="0 0 300 300"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                    }}
                >
                    {renderWheel()}
                    <circle cx="150" cy="150" r="20" fill="#1a1a2e" stroke="#fff" strokeWidth="3" />
                </svg>
            </div>

            {result && result.reward !== undefined && !result.error && !isSpinning && (
                <div className={`game-result ${result.reward === 0 ? 'tryagain' : 'success'}`}>
                    <Sparkles size={24} />
                    <div>
                        {result.reward === 0 ? (
                            <>
                                <span className="result-label">{result.rewardLabel || 'Try Again!'}</span>
                                <span className="result-value">Better luck next time!</span>
                            </>
                        ) : (
                            <>
                                <span className="result-label">You won!</span>
                                <span className="result-value">{Math.round(result.reward)} Credits</span>
                                {result.multiplier > 1 && (
                                    <span className="vip-bonus">VIP Multiplier: {result.multiplier}x</span>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {result?.error && (
                <div className="game-result error">
                    {result.error}
                </div>
            )}

            {/* Show spin button when available and no result yet */}
            {!result && (
                <button
                    className="btn btn-gold btn-lg spin-btn"
                    onClick={handleSpin}
                    disabled={!isAvailable || isSpinning || playing}
                >
                    {playing || isSpinning ? (
                        <>
                            <div className="spinner" style={{ width: 20, height: 20 }}></div>
                            Spinning...
                        </>
                    ) : (
                        <>
                            <Gift size={20} />
                            Spin the Wheel!
                        </>
                    )}
                </button>
            )}

            {/* Show Play Again after result */}
            {result && !result.error && !isSpinning && (
                <button
                    className="btn btn-primary btn-lg"
                    onClick={onClose}
                    style={{ marginTop: '1rem' }}
                >
                    🎮 Play Again
                </button>
            )}
        </div>
    );
}
