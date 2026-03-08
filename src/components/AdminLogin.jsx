import { useState } from 'react';
import { motion } from 'framer-motion';
import '../styles/AdminLogin.css';

// Credentials stored as SHA-256 hashes — plaintext password never lives in the bundle.
// Username is less sensitive so stored as-is.
const ADMIN_USERNAME = 'cyberthon';
const ADMIN_PASSWORD_HASH = '8e1ec4ecd989ee9097f3ded1de426a8865f41b08a';

async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AdminLogin({ onAuthenticated }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const passwordHash = await sha256(password);
            if (username === ADMIN_USERNAME && passwordHash === ADMIN_PASSWORD_HASH) {
                // Store auth in sessionStorage — clears when tab/browser closes
                sessionStorage.setItem('cyberthon_admin_auth', '1');
                onAuthenticated();
            } else {
                setError('Invalid credentials. Access denied.');
            }
        } catch {
            setError('Authentication error. Try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            className="admin-login-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Corner brackets */}
            <div className="login-bracket login-bracket--tl" />
            <div className="login-bracket login-bracket--tr" />
            <div className="login-bracket login-bracket--bl" />
            <div className="login-bracket login-bracket--br" />

            <motion.div
                className="login-card"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            >
                {/* Header */}
                <div className="login-header">
                    <div className="login-lock-icon">⬡</div>
                    <h1 className="login-title">RESTRICTED ACCESS</h1>
                    <p className="login-subtitle">CYBERTHON'26 Coordinator Panel</p>
                </div>

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="login-field">
                        <label className="login-label">USERNAME</label>
                        <div className="login-input-wrapper">
                            <span className="login-input-icon">◈</span>
                            <input
                                className="login-input"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                autoComplete="username"
                                required
                            />
                        </div>
                    </div>

                    <div className="login-field">
                        <label className="login-label">PASSWORD</label>
                        <div className="login-input-wrapper">
                            <span className="login-input-icon">◈</span>
                            <input
                                className="login-input"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            className="login-error"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            ⚠ {error}
                        </motion.div>
                    )}

                    <button
                        className={`login-btn ${isLoading ? 'loading' : ''}`}
                        type="submit"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="login-spinner">AUTHENTICATING...</span>
                        ) : (
                            <>
                                <span>AUTHENTICATE</span>
                                <span className="login-btn-arrow">›</span>
                            </>
                        )}
                    </button>
                </form>

                <div className="login-footer">
                    <div className="login-status-dot" />
                    <span>Secure Auth · SHA-256 · Session Scoped</span>
                </div>
            </motion.div>
        </motion.div>
    );
}
