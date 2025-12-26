import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import HeartIcon from './HeartIcon';

// v3.0 - Logo using ThemeContext instead of system prefers-color-scheme - Updated 2025-12-26

interface LogoProps {
    size?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 120, className = '' }) => {
    const { darkMode } = useTheme();
    const [imageError, setImageError] = useState(false);

    // Use white logo for dark mode, black logo for light mode
    const logoPath = darkMode ? '/img/logo_white.svg' : '/img/logo_black.svg';

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
                    color: darkMode ? '#ffffff' : '#000000',
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
