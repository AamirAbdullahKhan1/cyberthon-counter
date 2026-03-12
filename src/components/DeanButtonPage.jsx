import { useState } from 'react';
import socket from '../socket';
import { getTimerDuration, setTargetTime, setPhase } from '../channel';
import '../styles/DeanButtonPage.css';

export default function DeanButtonPage() {
    const [isInitiated, setIsInitiated] = useState(false);

    const handleInitiate = () => {
        // Double-check confirmation to prevent accidental touches
        if (window.confirm("Are you sure you want to INITIATE the Cyberthon'26 Countdown?")) {
            setIsInitiated(true);
            
            // Emit to server to trigger the countdown across all screens
            socket.emit('initiate');
            
            // Also explicitly set the local broadcast state as a fallback
            const durationMs = getTimerDuration() * 60 * 1000;
            const targetTime = Date.now() + durationMs;
            setTargetTime(targetTime);
            setPhase('countdown');
        }
    };

    return (
        <div className="dean-page">
            <div className="dean-container">
                <div className="dean-header">
                    <h2>DEAN'S CONSOLE</h2>
                    <p>Cyberthon'26 Authorization</p>
                </div>

                <div className="dean-button-wrapper">
                    <button 
                        className={`dean-initiate-btn ${isInitiated ? 'initiated' : ''}`}
                        onClick={handleInitiate}
                        disabled={isInitiated}
                    >
                        {isInitiated ? 'EVENT INITIATED ✓' : 'INITIATE EVENT'}
                    </button>
                </div>

                {isInitiated && (
                    <div className="dean-footer">
                        <p className="success-text">System is now online tracking countdown.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
