import React from 'react';

interface HeartIconProps {
    filled?: boolean;
    size?: number;
    className?: string;
}

const HeartIcon: React.FC<HeartIconProps> = ({ filled = false, size = 48, className = '' }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Main heart shape */}
            <path
                d="M50,85 C50,85 15,60 15,40 C15,28 22,20 30,20 C38,20 45,25 50,32 C55,25 62,20 70,20 C78,20 85,28 85,40 C85,60 50,85 50,85z"
                fill={filled ? '#E91E63' : 'none'}
                stroke="#E91E63"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />

            {/* Mandala decorative elements inside heart */}
            {filled && (
                <>
                    {/* Center circle */}
                    <circle cx="50" cy="45" r="8" fill="white" opacity="0.9" />
                    <circle cx="50" cy="45" r="5" fill="none" stroke="#E91E63" strokeWidth="1.5" />

                    {/* Petals around center */}
                    <g opacity="0.8">
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                            <ellipse
                                key={i}
                                cx="50"
                                cy="45"
                                rx="3"
                                ry="8"
                                fill="white"
                                transform={`rotate(${angle} 50 45)`}
                            />
                        ))}
                    </g>

                    {/* Dots pattern */}
                    <circle cx="50" cy="32" r="1.5" fill="white" opacity="0.9" />
                    <circle cx="50" cy="58" r="1.5" fill="white" opacity="0.9" />
                    <circle cx="38" cy="45" r="1.5" fill="white" opacity="0.9" />
                    <circle cx="62" cy="45" r="1.5" fill="white" opacity="0.9" />
                </>
            )}

            {/* Outline decorative dots when not filled */}
            {!filled && (
                <>
                    <circle cx="50" cy="45" r="2" fill="#E91E63" />
                    <circle cx="43" cy="40" r="1.5" fill="#E91E63" opacity="0.7" />
                    <circle cx="57" cy="40" r="1.5" fill="#E91E63" opacity="0.7" />
                    <circle cx="43" cy="50" r="1.5" fill="#E91E63" opacity="0.7" />
                    <circle cx="57" cy="50" r="1.5" fill="#E91E63" opacity="0.7" />
                </>
            )}
        </svg>
    );
};

export default HeartIcon;
