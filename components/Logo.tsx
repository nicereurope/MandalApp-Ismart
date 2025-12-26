import React, { useState, useEffect } from 'react';

// v1.0 - Logo with dark mode detection - Updated 2025-12-25

interface LogoProps {
    size?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 120, className = '' }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Detect dark mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Use white logo for dark mode, black logo for light mode
    const logoPath = isDarkMode ? '/img/logo_white.svg' : '/img/logo_black.svg';

    return (
        <img
            src={logoPath}
            alt="Gudiño"
            className={className}
            style={{
                height: size,
                width: 'auto',
                display: 'block'
            }}
        />
    );
};

export default Logo;
