import { useState, useRef } from 'react';
import socket from '../socket';
import '../styles/AdminPanel.css';

const PRESET_MESSAGES = [
    { emoji: '🔔', text: 'Break Time — 15 minutes!' },
    { emoji: '⚡', text: 'Judging Starts Now!' },
    { emoji: '⏰', text: '1 Hour Remaining!' },
    { emoji: '🏆', text: "Time's Up! Submit Now!" },
    { emoji: '🍕', text: 'Food has arrived!' },
    { emoji: '📢', text: 'Mentors available now' },
    { emoji: '🎯', text: 'Midpoint Check-in' },
    { emoji: '🚀', text: 'Final Sprint begins!' },
    { emoji: '🔧', text: 'Technical issue — Stand by' },
    { emoji: '🎉', text: 'Winners announced soon!' },
];

export default function AdminPanel() {
    const [message, setMessage] = useState('');
    const [duration, setDuration] = useState('1440');
    const [sentLog, setSentLog] = useState([]);
    const [connected, setConnected] = useState(socket.connected);
    const textareaRef = useRef(null);

    // Track connection status
    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    const handleSendNotification = (msg) => {
        const text = msg || message.trim();
        if (!text) return;
        socket.emit('send-notification', { message: text });
        setSentLog((prev) => [
            { id: Date.now(), message: text, time: new Date().toLocaleTimeString() },
            ...prev,
        ]);
        if (!msg) {
            setMessage('');
            textareaRef.current?.focus();
        }
    };

    const handleInitiate = () => {
        socket.emit('initiate');
    };

    const handleSetTimer = () => {
        const mins = parseInt(duration, 10);
        if (isNaN(mins) || mins <= 0) return;
        socket.emit('set-timer', { duration: mins });
    };

    const handleReset = () => {
        if (window.confirm('Reset everything back to Inauguration screen?\nThis will affect ALL connected screens.')) {
            socket.emit('reset');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendNotification();
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                {/* Header */}
                <header className="admin-header">
                    <div className="admin-header-left">
                        <h1 className="admin-title">⚙ COORDINATOR PANEL</h1>
                        <p className="admin-subtitle">CYBERTHON'26 Event Control</p>
                    </div>
                    <div className={`connection-badge ${connected ? 'connected' : 'disconnected'}`}>
                        <span className="conn-dot" />
                        <span>{connected ? 'CONNECTED' : 'DISCONNECTED'}</span>
                    </div>
                </header>

                <div className="admin-grid">
                    {/* Left Column — Controls */}
                    <div className="admin-col">
                        {/* Event Controls */}
                        <section className="admin-card">
                            <h2 className="card-title">Event Controls</h2>
                            <div className="control-row">
                                <button className="admin-btn admin-btn--primary" onClick={handleInitiate}>
                                    ⏻ Initiate Event
                                </button>
                                <button className="admin-btn admin-btn--danger" onClick={handleReset}>
                                    ↺ Reset All
                                </button>
                            </div>
                        </section>

                        {/* Timer Controls */}
                        <section className="admin-card">
                            <h2 className="card-title">Timer Controls</h2>
                            <div className="control-row">
                                <input
                                    type="number"
                                    className="admin-input"
                                    placeholder="Duration (minutes)"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    min="1"
                                />
                                <button className="admin-btn admin-btn--primary" onClick={handleSetTimer}>
                                    Set & Start
                                </button>
                            </div>
                            <div className="timer-presets">
                                {[15, 30, 60, 120, 360, 720, 1440].map((mins) => (
                                    <button
                                        key={mins}
                                        className="preset-pill"
                                        onClick={() => {
                                            setDuration(String(mins));
                                        }}
                                    >
                                        {mins < 60 ? `${mins}m` : `${mins / 60}h`}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Send Custom Notification */}
                        <section className="admin-card">
                            <h2 className="card-title">Send Notification</h2>
                            <textarea
                                ref={textareaRef}
                                className="admin-textarea"
                                placeholder="Type your announcement message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={3}
                            />
                            <button
                                className="admin-btn admin-btn--send"
                                onClick={() => handleSendNotification()}
                                disabled={!message.trim()}
                            >
                                📢 Broadcast to All Screens
                            </button>
                        </section>
                    </div>

                    {/* Right Column — Templates & Log */}
                    <div className="admin-col">
                        {/* Template Notifications */}
                        <section className="admin-card">
                            <h2 className="card-title">Quick Templates</h2>
                            <div className="template-grid">
                                {PRESET_MESSAGES.map((preset, index) => (
                                    <button
                                        key={index}
                                        className="template-btn"
                                        onClick={() => handleSendNotification(`${preset.emoji} ${preset.text}`)}
                                    >
                                        <span className="template-emoji">{preset.emoji}</span>
                                        <span className="template-text">{preset.text}</span>
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Sent Log */}
                        <section className="admin-card">
                            <h2 className="card-title">Sent Log</h2>
                            <div className="sent-log">
                                {sentLog.length === 0 ? (
                                    <p className="log-empty">No notifications sent yet.</p>
                                ) : (
                                    sentLog.map((entry) => (
                                        <div key={entry.id} className="log-entry">
                                            <span className="log-time">{entry.time}</span>
                                            <span className="log-message">{entry.message}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
