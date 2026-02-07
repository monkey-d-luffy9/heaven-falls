import { useState, useRef, useEffect } from 'react';
import { Gift, Sparkles } from 'lucide-react';
import './GameComponents.css';

export default function ScratchGame({ game, onPlay, result, playing, isAvailable }) {
    const canvasRef = useRef(null);
    const [isScratching, setIsScratching] = useState(false);
    const [scratched, setScratched] = useState(false);
    const [scratchPercent, setScratchPercent] = useState(0);
    const [revealed, setRevealed] = useState(false);
    const lastPointRef = useRef(null);

    useEffect(() => {
        initCanvas();
    }, []);

    useEffect(() => {
        if (result && !result.error) {
            setRevealed(true);
        }
    }, [result]);

    const initCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Create gradient scratch area
        const gradient = ctx.createLinearGradient(0, 0, 250, 150);
        gradient.addColorStop(0, '#6C5CE7');
        gradient.addColorStop(0.5, '#A29BFE');
        gradient.addColorStop(1, '#6C5CE7');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 250, 150);

        // Add pattern
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * 250, Math.random() * 150, Math.random() * 5 + 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Add text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = 'bold 18px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SCRATCH HERE', 125, 80);
    };

    const scratch = (x, y) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const canvasX = (x - rect.left) * (canvas.width / rect.width);
        const canvasY = (y - rect.top) * (canvas.height / rect.height);

        ctx.globalCompositeOperation = 'destination-out';

        if (lastPointRef.current) {
            ctx.beginPath();
            ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
            ctx.lineTo(canvasX, canvasY);
            ctx.lineWidth = 40;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 20, 0, Math.PI * 2);
        ctx.fill();

        lastPointRef.current = { x: canvasX, y: canvasY };

        // Calculate scratch percentage
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let cleared = 0;
        for (let i = 3; i < imageData.data.length; i += 4) {
            if (imageData.data[i] === 0) cleared++;
        }
        const percent = (cleared / (imageData.data.length / 4)) * 100;
        setScratchPercent(percent);

        // Auto-reveal at 50%
        if (percent >= 50 && !scratched && !playing) {
            setScratched(true);
            onPlay();
        }
    };

    const handleMouseDown = (e) => {
        if (!isAvailable || revealed) return;
        setIsScratching(true);
        scratch(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
        if (!isScratching || !isAvailable || revealed) return;
        scratch(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
        setIsScratching(false);
        lastPointRef.current = null;
    };

    const handleTouchStart = (e) => {
        if (!isAvailable || revealed) return;
        e.preventDefault();
        setIsScratching(true);
        const touch = e.touches[0];
        scratch(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
        if (!isScratching || !isAvailable || revealed) return;
        e.preventDefault();
        const touch = e.touches[0];
        scratch(touch.clientX, touch.clientY);
    };

    return (
        <div className="scratch-game">
            <h2>🎫 Scratch & Win</h2>
            <p>Scratch the card to reveal your prize!</p>

            <div className="scratch-card">
                <div className="scratch-prize">
                    {result && result.reward !== undefined && !result.error ? (
                        <>
                            <Sparkles size={32} className="sparkle-icon" />
                            <span className="prize-value">{result.reward.toFixed(2)}</span>
                            <span className="prize-label">Credits!</span>
                            {result.multiplier > 1 && (
                                <span className="vip-bonus-tag">VIP {result.multiplier}x</span>
                            )}
                        </>
                    ) : (
                        <>
                            <Gift size={32} />
                            <span className="prize-label">Your Prize</span>
                        </>
                    )}
                </div>

                <canvas
                    ref={canvasRef}
                    width={250}
                    height={150}
                    className={`scratch-canvas ${revealed ? 'hidden' : ''}`}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                />
            </div>

            {!revealed && (
                <div className="scratch-progress">
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${Math.min(100, scratchPercent * 2)}%` }}
                        ></div>
                    </div>
                    <span>{Math.round(Math.min(100, scratchPercent * 2))}% scratched</span>
                </div>
            )}

            {result && result.reward !== undefined && !result.error && (
                <div className="game-result success">
                    <Gift size={24} />
                    <div>
                        <span className="result-label">Congratulations!</span>
                        <span className="result-value">{result.reward.toFixed(2)} Credits Won!</span>
                    </div>
                </div>
            )}

            {result?.error && (
                <div className="game-result error">
                    {result.error}
                </div>
            )}

            {playing && (
                <div className="scratch-loading">
                    <div className="spinner"></div>
                    <span>Revealing prize...</span>
                </div>
            )}
        </div>
    );
}
