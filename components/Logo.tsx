import React, { useState, useEffect } from 'react';
import HeartIcon from './HeartIcon';

// v2.0 - Logo with fallback to HeartIcon + text - Updated 2025-12-25

interface LogoProps {
    size?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 120, className = '' }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        // Detect dark mode
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setIsDarkMode(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    // Try multiple paths for Vercel compatibility
    const logoPath = isDarkMode ? '/img/logo_white.svg' : '/img/logo_black.svg';

    // Fallback component if image fails to load
    if (imageError) {
        return (
            <div
                className={className}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: size
                }}
            >
                <HeartIcon filled={true} size={size * 0.4} />
                <span style={{
                    fontSize: size * 0.3,
                    fontWeight: 700,
                    color: isDarkMode ? '#ffffff' : '#000000',
                    fontFamily: 'Inter, sans-serif'
                }}>
                    GUDIÑO
                </span>
            </div>
        );
    }

    return (
        <img
            src={logoPath}
            alt="Gudiño"
            className={className}
            onError={() => setImageError(true)}
            style={{
                height: size,
                width: 'auto',
                display: 'block'
            }}
        />
    );
};

export default Logo;
