import { useState, useEffect, useRef } from 'react';
import { playAlertSound, playFaaahSound, onMessage } from '../channel';
import '../styles/NotificationOverlay.css';

export default function NotificationOverlay({ notifications }) {
    const [visibleNotifications, setVisibleNotifications] = useState([]);
    const processedIds = useRef(new Set());

    useEffect(() => {
        // Listen for sound-only broadcasts
        const handleMessage = (data) => {
            if (data.type === 'sound-faaah') {
                playFaaahSound();
            }
        };
        // We only want to set this up once, but the underlying onMessage isn't unsubscribable
        // in our current channel.js setup. Since the overlay mounts once on the countdown page, it's fine.
        onMessage(handleMessage);

        if (notifications.length === 0) return;

        const latest = notifications[notifications.length - 1];
        if (processedIds.current.has(latest.id)) return;
        processedIds.current.add(latest.id);

        // Play alert sound
        playAlertSound();

        const notif = {
            ...latest,
            progress: 100,
            exiting: false,
        };

        setVisibleNotifications((prev) => [...prev, notif]);

        // Progress bar countdown over 8 seconds
        const progressInterval = setInterval(() => {
            setVisibleNotifications((prev) =>
                prev.map((n) =>
                    n.id === notif.id ? { ...n, progress: Math.max(0, n.progress - 1.25) } : n
                )
            );
        }, 100);

        // Start exit animation after 8 seconds
        setTimeout(() => {
            clearInterval(progressInterval);
            setVisibleNotifications((prev) =>
                prev.map((n) => (n.id === notif.id ? { ...n, exiting: true } : n))
            );
            // Remove after animation
            setTimeout(() => {
                setVisibleNotifications((prev) => prev.filter((n) => n.id !== notif.id));
            }, 400);
        }, 8000);

        return () => clearInterval(progressInterval);
    }, [notifications]);

    const dismissNotification = (id) => {
        setVisibleNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, exiting: true } : n))
        );
        setTimeout(() => {
            setVisibleNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 400);
    };

    if (visibleNotifications.length === 0) return null;

    return (
        <div className="notification-overlay">
            {visibleNotifications.map((notif) => (
                <div
                    key={notif.id}
                    className={`notification-banner ${notif.exiting ? 'exiting' : ''}`}
                >
                    <div className="notification-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </div>
                    <div className="notification-content">
                        <div className="notification-label">Announcement</div>
                        <div className="notification-message">{notif.message}</div>
                        <div className="notification-timer">
                            <div
                                className="notification-timer-bar"
                                style={{ width: `${notif.progress}%` }}
                            />
                        </div>
                    </div>
                    <button
                        className="notification-close"
                        onClick={() => dismissNotification(notif.id)}
                    >
                        ✕
                    </button>
                </div>
            ))}
        </div>
    );
}
