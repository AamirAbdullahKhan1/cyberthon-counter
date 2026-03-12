import { useState } from 'react';
import { motion } from 'framer-motion';
import { setPhase, setTargetTime, getTimerDuration } from '../channel';
import socket from '../socket';
import pixelBlastVideo from '../assets/pixel-blast.webm';
import '../styles/InaugurationPage.css';

export default function InaugurationPage() {
    const [isInitiating, setIsInitiating] = useState(false);

    const handleInitiate = () => {
        setIsInitiating(true);

        // Small delay for visual feedback before transitioning
        setTimeout(() => {
            // Emit via Socket.io for cross-device sync
            socket.emit('initiate');
            // Also set locally via BroadcastChannel for instant feedback
            const durationMs = getTimerDuration() * 60 * 1000;
            const targetTime = Date.now() + durationMs;
            setTargetTime(targetTime);
            setPhase('countdown');
        }, 600);
    };

    const pageVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } },
        exit: { opacity: 0, scale: 0.9, filter: "blur(10px)", transition: { duration: 0.8, ease: "easeInOut" } }
    };

    return (
        <motion.div
            className="inauguration-page"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
        >
            {/* Background Video */}
            <video
                className="bg-video"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src={pixelBlastVideo} type="video/webm" />
            </video>

            {/* Corner Brackets */}
            <div className="corner-bracket corner-bracket--tl" />
            <div className="corner-bracket corner-bracket--tr" />
            <div className="corner-bracket corner-bracket--bl" />
            <div className="corner-bracket corner-bracket--br" />

            {/* Main Content */}
            <div className="inauguration-content">
                <div className="inauguration-sparkle">
                    <span className="sparkle-icon">✦</span>
                    <h1 className="inauguration-title">CYBERTHON'26</h1>
                </div>

                <p className="inauguration-subtitle">
                    DIGITAL FRONTIER INAUGURATION
                </p>

                <button
                    className={`initiate-btn ${isInitiating ? 'initiating' : ''}`}
                    onClick={handleInitiate}
                    disabled={isInitiating}
                >
                    <span className="btn-icon">⏻</span>
                    <span>INITIATE</span>
                    <span className="btn-arrow">›</span>
                </button>

                <div className="inauguration-stats">
                    <div className="stat-item">
                        <div className="stat-label">Protocol</div>
                        <div className="stat-value">SECURE-X7</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Uptime</div>
                        <div className="stat-value">99.9%</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">Nodes</div>
                        <div className="stat-value">1,024</div>
                    </div>
                </div>
            </div>

            {/* Bottom Status Bar */}
            <div className="inauguration-status-bar">
                <div className="status-indicator">
                    <div className="status-dot" />
                    <span className="status-text">System Ready for Deployment</span>
                </div>
                <div className="auth-key">AUTH_KEY: 882-XCA-992-KLA</div>
            </div>

            <div className="inauguration-icons">
                <button className="icon-btn" title="Network Status">⊕</button>
                <button className="icon-btn" title="Connected Nodes">⊞</button>
            </div>
        </motion.div>
    );
}
