import { useEffect, useState, useRef } from 'react';

export default function DecryptedText({
    text = "",
    speed = 80,
    maxIterations = 7,
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+",
    className = "",
    animateOn = "view", // "view" or "hover"
    ...props
}) {
    const [displayText, setDisplayText] = useState(text);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef(null);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        if (animateOn === 'view' && !hasAnimatedRef.current) {
            startAnimation();
            hasAnimatedRef.current = true;
        }
    }, [text, animateOn]);

    useEffect(() => {
        if (animateOn === 'hover') {
            if (isHovering) {
                startAnimation();
            } else {
                setDisplayText(text);
                if (intervalRef.current) clearInterval(intervalRef.current);
            }
        }
    }, [isHovering, text, animateOn]);

    const startAnimation = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        let iteration = 0;

        // Initialize immediately with scrambled text rather than waiting for the first interval tick
        setDisplayText(
            text.split('').map(letter => letter === ' ' ? ' ' : characters[Math.floor(Math.random() * characters.length)]).join('')
        );

        intervalRef.current = setInterval(() => {
            let shouldClear = false;
            
            setDisplayText(() => {
                if (iteration >= text.length) {
                    shouldClear = true;
                    return text; // Return exact target text at the end
                }

                const newText = text.split('')
                    .map((letter, index) => {
                        if (letter === ' ') return ' ';

                        // Resolve characters one by one based on iterations
                        if (index < Math.floor(iteration)) {
                            return text[index];
                        }

                        // Continue scrambling the rest
                        return characters[Math.floor(Math.random() * characters.length)];
                    })
                    .join('');

                iteration += 1 / maxIterations;
                return newText;
            });

            if (shouldClear) {
                clearInterval(intervalRef.current);
            }
        }, speed);
    };

    // Clean up interval on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    return (
        <span
            className={`decrypted-text ${className}`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            {...props}
        >
            {displayText || text}
        </span>
    );
}
