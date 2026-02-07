import { useState, useEffect } from 'react';
import './CountdownTimer.css';

export default function CountdownTimer({ targetDate, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
        const difference = new Date(targetDate) - new Date();

        if (difference <= 0) {
            return { hours: 0, minutes: 0, seconds: 0, expired: true };
        }

        return {
            hours: Math.floor(difference / (1000 * 60 * 60)),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            expired: false
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            setTimeLeft(newTimeLeft);

            if (newTimeLeft.expired && onComplete) {
                onComplete();
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate, onComplete]);

    if (timeLeft.expired) {
        return <span className="countdown-available">Available Now!</span>;
    }

    const pad = (num) => String(num).padStart(2, '0');

    return (
        <div className="countdown">
            <div className="countdown-item">
                <span className="countdown-value">{pad(timeLeft.hours)}</span>
                <span className="countdown-label">hrs</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-item">
                <span className="countdown-value">{pad(timeLeft.minutes)}</span>
                <span className="countdown-label">min</span>
            </div>
            <span className="countdown-separator">:</span>
            <div className="countdown-item">
                <span className="countdown-value">{pad(timeLeft.seconds)}</span>
                <span className="countdown-label">sec</span>
            </div>
        </div>
    );
}
