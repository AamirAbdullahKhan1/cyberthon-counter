import React from 'react';
import '../styles/LogoLoop.css';

// 4 Sponsor Logos
import logoCybertracs from '../assets/cybertracs-logo-w.png';
import logoThinkroot from '../assets/thinkroot-logo.png';
import logoFortinet from '../assets/fortinet-logo.png';
import logoYespanchi from '../assets/yespanchi-logo.png';
import logoTeddys from '../assets/teddys-logo.png'
import logoSbi from '../assets/sbi-logo.png'

const logos = [
    { src: logoCybertracs, alt: "Cybertracs" },
    { src: logoThinkroot, alt: "Thinkroot" },
    { src: logoFortinet, alt: "Fortinet" },
    { src: logoYespanchi, alt: "Yespanchi" },
    { src: logoTeddys, alt: "Teddys" },
    { src: logoSbi, alt: "SBI" },
];

export default function LogoLoop() {
    return (
        <div className="logo-loop-container">
            <div className="logo-loop-track">
                {/* 
                  Render multiple sets of logos to ensure the track 
                  is wide enough to loop seamlessly on giant screens.
                */}
                {[1, 2, 3, 4].map((setIndex) => (
                    <React.Fragment key={setIndex}>
                        {logos.map((logo, index) => (
                            <div className="logo-slide" key={`${setIndex}-${index}`}>
                                <img src={logo.src} alt={logo.alt} className="sponsor-logo-img" />
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
