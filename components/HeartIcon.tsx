import React from 'react';

interface HeartIconProps {
    filled?: boolean;
    size?: number;
    className?: string;
    onClick?: () => void;
}

const HeartIcon: React.FC<HeartIconProps> = ({ filled = false, size = 48, className = '', onClick }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {filled ? (
                // FILLED HEART - Mandala completo con pétalos y detalles
                <>
                    {/* Main heart shape - filled */}
                    <path
                        d="M50,85 C50,85 15,60 15,40 C15,28 22,20 30,20 C38,20 45,25 50,32 C55,25 62,20 70,20 C78,20 85,28 85,40 C85,60 50,85 50,85z"
                        fill="#E91E63"
                        stroke="#C2185B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Center mandala circle */}
                    <circle cx="50" cy="45" r="10" fill="white" opacity="0.95" />
                    <circle cx="50" cy="45" r="7" fill="none" stroke="#E91E63" strokeWidth="1.5" />
                    <circle cx="50" cy="45" r="3" fill="#E91E63" />

                    {/* 8 petals around center */}
                    <g opacity="0.9">
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                            <ellipse
                                key={i}
                                cx="50"
                                cy="45"
                                rx="2.5"
                                ry="9"
                                fill="white"
                                transform={`rotate(${angle} 50 45)`}
                            />
                        ))}
                    </g>

                    {/* Decorative dots in cross pattern */}
                    <circle cx="50" cy="30" r="2" fill="white" opacity="0.95" />
                    <circle cx="50" cy="60" r="2" fill="white" opacity="0.95" />
                    <circle cx="35" cy="45" r="2" fill="white" opacity="0.95" />
                    <circle cx="65" cy="45" r="2" fill="white" opacity="0.95" />

                    {/* Accent dots */}
                    <circle cx="42" cy="37" r="1.5" fill="white" opacity="0.8" />
                    <circle cx="58" cy="37" r="1.5" fill="white" opacity="0.8" />
                    <circle cx="42" cy="53" r="1.5" fill="white" opacity="0.8" />
                    <circle cx="58" cy="53" r="1.5" fill="white" opacity="0.8" />
                </>
            ) : (
                // EMPTY HEART - Contorno con mandala minimalista
                <>
                    {/* Main heart shape - outline */}
                    <path
                        d="M50,85 C50,85 15,60 15,40 C15,28 22,20 30,20 C38,20 45,25 50,32 C55,25 62,20 70,20 C78,20 85,28 85,40 C85,60 50,85 50,85z"
                        fill="none"
                        stroke="#E91E63"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Inner decorative circle */}
                    <circle cx="50" cy="45" r="8" fill="none" stroke="#E91E63" strokeWidth="1.5" opacity="0.6" />

                    {/* Center dot */}
                    <circle cx="50" cy="45" r="2.5" fill="#E91E63" />

                    {/* 4 small petals - minimal mandala */}
                    <g opacity="0.5">
                        {[0, 90, 180, 270].map((angle, i) => (
                            <ellipse
                                key={i}
                                cx="50"
                                cy="45"
                                rx="1.5"
                                ry="6"
                                fill="none"
                                stroke="#E91E63"
                                strokeWidth="1"
                                transform={`rotate(${angle} 50 45)`}
                            />
                        ))}
                    </g>

                    {/* 4 corner dots */}
                    <circle cx="43" cy="38" r="1.5" fill="#E91E63" opacity="0.6" />
                    <circle cx="57" cy="38" r="1.5" fill="#E91E63" opacity="0.6" />
                    <circle cx="43" cy="52" r="1.5" fill="#E91E63" opacity="0.6" />
                    <circle cx="57" cy="52" r="1.5" fill="#E91E63" opacity="0.6" />
                </>
            )}
        </svg>
    );
};

export default HeartIcon;
