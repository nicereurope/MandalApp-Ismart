import React, { useState, useEffect } from 'react';

interface Step {
    targetId: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TourProps {
    steps: Step[];
    tourKey: string;
    onComplete?: () => void;
}

const Tour: React.FC<TourProps> = ({ steps, tourKey, onComplete }) => {
    const [currentStep, setCurrentStep] = useState<number>(-1);
    const [isVisible, setIsVisible] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem(`tour_${tourKey}`);
        if (!hasSeenTour) {
            setTimeout(() => {
                setIsVisible(true);
                setCurrentStep(0);
            }, 1500); // Wait for page load
        }
    }, [tourKey]);

    useEffect(() => {
        if (isVisible && currentStep >= 0 && currentStep < steps.length) {
            const target = document.getElementById(steps[currentStep].targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => {
                    setTargetRect(target.getBoundingClientRect());
                }, 500);
            } else {
                // If target not found, skip to next or center it
                setTargetRect(null);
            }
        }
    }, [currentStep, isVisible, steps]);

    // Update rect on scroll/resize
    useEffect(() => {
        const updateRect = () => {
            if (isVisible && currentStep >= 0) {
                const target = document.getElementById(steps[currentStep].targetId);
                if (target) setTargetRect(target.getBoundingClientRect());
            }
        };
        window.addEventListener('scroll', updateRect);
        window.addEventListener('resize', updateRect);
        return () => {
            window.removeEventListener('scroll', updateRect);
            window.removeEventListener('resize', updateRect);
        };
    }, [currentStep, isVisible, steps]);

    if (!isVisible || currentStep === -1) return null;

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = () => {
        localStorage.setItem(`tour_${tourKey}`, 'true');
        setIsVisible(false);
        if (onComplete) onComplete();
    };

    const step = steps[currentStep];

    // Spotlight styles
    const spotlightStyle: React.CSSProperties = targetRect ? {
        position: 'fixed',
        top: targetRect.top - 8,
        left: targetRect.left - 8,
        width: targetRect.width + 16,
        height: targetRect.height + 16,
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        zIndex: 9999,
        pointerEvents: 'none',
        transition: 'all 0.3s ease'
    } : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
        pointerEvents: 'none'
    };

    // Tooltip position
    const getTooltipStyle = (): React.CSSProperties => {
        if (!targetRect) return {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10000
        };

        const margin = 20;
        const tooltipWidth = 280;

        let top = targetRect.bottom + margin;
        let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);

        // Adjust if off-screen
        if (left < 10) left = 10;
        if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10;
        if (top + 150 > window.innerHeight) top = targetRect.top - 180;

        return {
            position: 'fixed',
            top,
            left,
            width: tooltipWidth,
            zIndex: 10000,
            transition: 'all 0.3s ease'
        };
    };

    return (
        <>
            <div style={spotlightStyle} />
            <div
                className="minimal-card"
                style={{
                    ...getTooltipStyle(),
                    padding: '20px',
                    background: 'var(--color-bg-primary)',
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: 'var(--color-accent-primary)',
                        textTransform: 'uppercase'
                    }}>
                        Paso {currentStep + 1} de {steps.length}
                    </span>
                    <button
                        onClick={handleComplete}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-tertiary)' }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                    </button>
                </div>

                <h3 className="text-h3" style={{ marginBottom: '8px', fontSize: '18px' }}>{step.title}</h3>
                <p className="text-small" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.4', marginBottom: '20px' }}>
                    {step.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    {currentStep > 0 && (
                        <button
                            className="minimal-button-secondary"
                            style={{ fontSize: '12px', padding: '6px 12px' }}
                            onClick={() => setCurrentStep(currentStep - 1)}
                        >
                            Anterior
                        </button>
                    )}
                    <button
                        className="minimal-button-primary"
                        style={{ fontSize: '12px', padding: '6px 20px' }}
                        onClick={handleNext}
                    >
                        {currentStep === steps.length - 1 ? '¡Entendido!' : 'Siguiente'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Tour;
