import { useState, useEffect, useRef } from 'react';

export default function CountdownTimer({ targetTime }) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [prevDigits, setPrevDigits] = useState({ hours: '', minutes: '', seconds: '' });
    const intervalRef = useRef(null);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = Date.now();
            const diff = Math.max(0, targetTime - now);

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft((prev) => {
                setPrevDigits({
                    hours: String(prev.hours).padStart(2, '0'),
                    minutes: String(prev.minutes).padStart(2, '0'),
                    seconds: String(prev.seconds).padStart(2, '0'),
                });
                return { hours, minutes, seconds };
            });

            if (diff === 0 && intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };

        calculateTimeLeft();
        intervalRef.current = setInterval(calculateTimeLeft, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [targetTime]);

    const formatDigit = (value) => String(value).padStart(2, '0');

    const renderDigitCard = (label, value, key) => {
        const formatted = formatDigit(value);
        const prevFormatted = prevDigits[key] || formatted;
        const hasChanged = formatted !== prevFormatted;

        return (
            <div className="timer-unit" key={key}>
                <div className="timer-label">{label}</div>
                <div className={`timer-card ${hasChanged ? 'digit-changed' : ''}`}>
                    <span className="timer-digit">{formatted}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="timer-container">
            {renderDigitCard('HOURS', timeLeft.hours, 'hours')}
            <span className="timer-separator">:</span>
            {renderDigitCard('MINUTES', timeLeft.minutes, 'minutes')}
            <span className="timer-separator">:</span>
            {renderDigitCard('SECONDS', timeLeft.seconds, 'seconds')}
        </div>
    );
}
