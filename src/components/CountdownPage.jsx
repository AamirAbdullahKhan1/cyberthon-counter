import { motion } from 'framer-motion';
import CountdownTimer from './CountdownTimer';
import gridScanVideo from '../assets/grid-scan.webm';
import srmLogo from '../assets/srm-logo.png';
import cceeLogo from '../assets/ccee-logo.png';
import LogoLoop from './LogoLoop';
import '../styles/CountdownPage.css';

export default function CountdownPage({ targetTime }) {
    // Dramatic curtain opening variants
    const curtainVariants = {
        hidden: { opacity: 0, y: "100%", filter: "brightness(0)" },
        visible: {
            opacity: 1,
            y: "0%",
            filter: "brightness(1)",
            transition: {
                duration: 1.5,
                ease: [0.22, 1, 0.36, 1], // cinematic decel
                when: "beforeChildren",
                staggerChildren: 0.2
            }
        },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <motion.div
            className="countdown-page"
            variants={curtainVariants}
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
                <source src={gridScanVideo} type="video/webm" />
            </video>

            {/* Top Logos */}
            <motion.div className="top-logos" variants={itemVariants}>
                <motion.img 
                    src={srmLogo} 
                    alt="SRM Logo" 
                    className="top-logo logo-left"
                    initial={{ opacity: 0, scale: 0.8, x: -30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                />
                <motion.img 
                    src={cceeLogo} 
                    alt="CCEE Logo" 
                    className="top-logo logo-right"
                    initial={{ opacity: 0, scale: 0.8, x: 30 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                />
            </motion.div>

            {/* Hero Section — everything in one viewport */}
            <motion.div className="countdown-hero" variants={itemVariants}>
                {/* System Online Badge */}
                <div className="system-badge">
                    <div className="badge-dot" />
                    <span className="badge-text">System Online</span>
                </div>

                {/* Title */}
                <h1 className="countdown-title">
                    <span className="title-white">CYBERTHON</span>
                    <span className="title-blue">'26</span>
                </h1>

                {/* Subtitle */}
                <p className="countdown-subtitle">
                    24 hours of pure innovation. Initialize your local
                    environment. The breach begins in:
                </p>

                {/* Countdown Timer */}
                <CountdownTimer targetTime={targetTime} />
            </motion.div>

            {/* Sponsors — pinned to bottom */}
            <motion.div className="sponsors-section" variants={itemVariants}>
                <div className="sponsors-label">STRATEGIC PARTNERS & SPONSORS</div>
                <LogoLoop />
            </motion.div>
        </motion.div>
    );
}
