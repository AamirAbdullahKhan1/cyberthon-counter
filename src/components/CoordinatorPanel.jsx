import { useState, useRef } from 'react';
import { sendNotification, setTargetTime, setTimerDuration, resetState, setPhase } from '../channel';
import '../styles/CoordinatorPanel.css';

const PRESET_MESSAGES = [
    '🔔 Break Time — 15 minutes!',
    '⚡ Judging Starts Now!',
    '⏰ 1 Hour Remaining!',
    '🏆 Time\'s Up! Submit Now!',
    '🍕 Food has arrived!',
    '📢 Mentors available now',
    '🎯 Midpoint Check-in',
    '🚀 Final Sprint begins!',
];

export default function CoordinatorPanel({ isOpen, onClose }) {
    const [message, setMessage] = useState('');
    const [duration, setDuration] = useState('1440');
    const textareaRef = useRef(null);

    if (!isOpen) return null;

    const handleSendNotification = () => {
        if (!message.trim()) return;
        sendNotification(message.trim());
        setMessage('');
        textareaRef.current?.focus();
    };

    const handlePresetClick = (preset) => {
        sendNotification(preset);
    };

    const handleSetTimer = () => {
        const mins = parseInt(duration, 10);
        if (isNaN(mins) || mins <= 0) return;
        setTimerDuration(mins);
        const targetTime = Date.now() + mins * 60 * 1000;
        setTargetTime(targetTime);
    };

    const handleReset = () => {
        resetState();
        setPhase('inauguration');
        window.location.reload();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendNotification();
        }
    };

    return (
        <>
            <div className="coordinator-panel-backdrop" onClick={onClose} />
            <div className="coordinator-panel">
                {/* Header */}
                <div className="panel-header">
                    <div className="panel-title">⚙ Coordinator Panel</div>
                    <button className="panel-close" onClick={onClose}>✕</button>
                </div>

                {/* Body */}
                <div className="panel-body">
                    {/* Timer Controls */}
                    <div className="panel-section">
                        <div className="panel-section-title">Timer Controls</div>
                        <div className="timer-controls">
                            <input
                                type="number"
                                className="timer-input"
                                placeholder="Duration (minutes)"
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                min="1"
                            />
                            <button className="control-btn" onClick={handleSetTimer}>
                                Set & Start
                            </button>
                        </div>
                        <button className="control-btn control-btn--danger" onClick={handleReset}>
                            Reset to Inauguration
                        </button>
                    </div>

                    {/* Send Notification */}
                    <div className="panel-section">
                        <div className="panel-section-title">Send Notification</div>
                        <div className="notification-input-group">
                            <textarea
                                ref={textareaRef}
                                className="notification-textarea"
                                placeholder="Type your announcement message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                rows={3}
                            />
                            <button className="send-btn" onClick={handleSendNotification}>
                                📢 Broadcast to all screens
                            </button>
                        </div>
                    </div>

                    {/* Preset Messages */}
                    <div className="panel-section">
                        <div className="panel-section-title">Quick Announcements</div>
                        <div className="preset-grid">
                            {PRESET_MESSAGES.map((preset, index) => (
                                <button
                                    key={index}
                                    className="preset-btn"
                                    onClick={() => handlePresetClick(preset)}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Hotkey Hints */}
                    <div className="panel-section">
                        <div className="panel-section-title">Keyboard Shortcuts</div>
                        <div className="hotkey-hint">
                            <span className="hotkey-hint-text">
                                <span className="hotkey-kbd">Ctrl</span> + <span className="hotkey-kbd">Shift</span> + <span className="hotkey-kbd">P</span> — Toggle this panel
                            </span>
                        </div>
                        <div className="hotkey-hint">
                            <span className="hotkey-hint-text">
                                <span className="hotkey-kbd">Ctrl</span> + <span className="hotkey-kbd">Shift</span> + <span className="hotkey-kbd">N</span> — Quick notification
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
