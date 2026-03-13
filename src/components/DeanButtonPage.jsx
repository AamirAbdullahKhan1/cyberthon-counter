import { useState } from 'react';
import socket from '../socket';
import { getTimerDuration, setTargetTime, setPhase, getSyncedTime } from '../channel';
import '../styles/DeanButtonPage.css';

export default function DeanButtonPage() {
    const [isInitiated, setIsInitiated] = useState(false);

    const handleInitiate = () => {
        setIsInitiated(true);
        
        // Emit to server to trigger the countdown across all screens
        socket.emit('initiate');
        
        // Also explicitly set the local broadcast state as a fallback
        const durationMs = getTimerDuration() * 60 * 1000;
        const targetTime = getSyncedTime() + durationMs;
        setTargetTime(targetTime);
        setPhase('countdown');
    };

    return (
        <div className="dean-page">
            <div className="dean-container">
                <div className="dean-header">
                    <h2>INITIATION CONSOLE</h2>
                    <p className="encryption-status">
                        <span className="status-dot"></span> ENCRYPTION ACTIVE
                    </p>
                </div>

                <div className="dean-auth-title">
                    CYBERTHON '26 AUTHORIZATION
                </div>

                <div className="dean-button-wrapper">
                    <div className={`initiate-ring-outer ${isInitiated ? 'initiated' : ''}`}>
                        <div className="initiate-ring-inner">
                            <button 
                                className="dean-initiate-btn"
                                onClick={handleInitiate}
                                disabled={isInitiated}
                            >
                                <svg className="fingerprint-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 11v6m-4-6v6m8-6v6" />
                                    <path d="M12 3a9 9 0 0 0-9 9m18 0a9 9 0 0 0-9-9" />
                                    <path d="M12 7a5 5 0 0 0-5 5m10 0a5 5 0 0 0-5-5" />
                                </svg>
                                <span className="btn-main-text">INITIATE</span>
                                <span className="btn-sub-text">EVENT MASTER TRIGGER</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="system-status-dots">
                    <span className="dot active"></span>
                    <span className="dot active"></span>
                    <span className="dot active"></span>
                    <span className="dot active"></span>
                </div>

                <div className="dean-footer">
                    SYSTEM STATUS: SECURE | STANDBY FOR COMMAND
                </div>
            </div>
        </div>
    );
}
