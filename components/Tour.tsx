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
    forceShow?: boolean;
}

const Tour: React.FC<TourProps> = ({ steps, tourKey, onComplete, forceShow }) => {
    const [currentStep, setCurrentStep] = useState<number>(-1);
    const [isVisible, setIsVisible] = useState(false);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const [isTargetMissing, setIsTargetMissing] = useState(false);

    useEffect(() => {
        const hasSeenTour = localStorage.getItem(`tour_${tourKey}`);
        if (!hasSeenTour || forceShow) {
            setTimeout(() => {
                setIsVisible(true);
                setCurrentStep(0);
            }, forceShow ? 100 : 1500);
        }
    }, [tourKey, forceShow]);

    useEffect(() => {
        if (isVisible && currentStep >= 0 && currentStep < steps.length) {
            const checkTarget = () => {
                const target = document.getElementById(steps[currentStep].targetId);
                if (target) {
                    setIsTargetMissing(false);
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Give scroll some time
                    setTimeout(() => {
                        setTargetRect(target.getBoundingClientRect());
                    }, 500);
                } else {
                    setIsTargetMissing(true);
                    setTargetRect(null);
                }
            };

            checkTarget();

            // Re-check periodically if missing (e.g. waiting for data)
            const interval = setInterval(() => {
                if (!document.getElementById(steps[currentStep].targetId)) {
                    setIsTargetMissing(true);
                } else if (isTargetMissing) {
                    checkTarget();
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentStep, isVisible, steps, isTargetMissing]);

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
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)', // Darker overlay for better focus
        borderRadius: '8px',
        zIndex: 9999,
        pointerEvents: 'none',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    } : {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
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

        const margin = 24;
        const tooltipWidth = 320;
        const tooltipHeight = 180; // Estimated

        // Horizontal centering
        let left = targetRect.left + (targetRect.width / 2) - (tooltipWidth / 2);

        // Vertical positioning (default to bottom)
        let top = targetRect.bottom + margin;

        // Constraint checks
        if (left < 20) left = 20;
        if (left + tooltipWidth > window.innerWidth - 20) left = window.innerWidth - tooltipWidth - 20;

        // If it goes off the bottom of the screen, show it above the target
        if (top + tooltipHeight > window.innerHeight - 20) {
            top = targetRect.top - tooltipHeight - margin;
        }

        // If it still goes off the top of the screen, just place it at the top
        if (top < 20) top = 20;

        return {
            position: 'fixed',
            top,
            left,
            width: tooltipWidth,
            zIndex: 10000,
            transition: 'all 0.4s ease'
        };
    };

    return (
        <>
            <div style={spotlightStyle} />
            <div
                className="minimal-card animate-fade-in"
                style={{
                    ...getTooltipStyle(),
                    padding: '24px',
                    background: 'var(--color-bg-primary)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--color-border-light)',
                    borderRadius: '16px'
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        color: 'var(--color-accent-primary)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>
                        {isTargetMissing ? 'Cargando contenido...' : `Paso ${currentStep + 1} de ${steps.length}`}
                    </span>
                    <button
                        onClick={handleComplete}
                        style={{
                            background: 'var(--color-bg-tertiary)',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-secondary)',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>close</span>
                    </button>
                </div>

                <h3 className="text-h2" style={{
                    marginBottom: '12px',
                    fontSize: '20px',
                    color: 'var(--color-text-primary)' // Explicit high contrast
                }}>
                    {isTargetMissing ? 'Espera un momento...' : step.title}
                </h3>
                <p className="text-body" style={{
                    color: 'var(--color-text-primary)', // Using primary for high readability
                    lineHeight: '1.6',
                    marginBottom: '24px',
                    fontSize: '15px',
                    opacity: 0.9
                }}>
                    {isTargetMissing ? 'Estamos preparando la sección para mostrártela.' : step.content}
                </p>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    {currentStep > 0 && (
                        <button
                            className="minimal-button-secondary"
                            style={{ fontSize: '13px', padding: '8px 16px' }}
                            onClick={() => setCurrentStep(currentStep - 1)}
                        >
                            Anterior
                        </button>
                    )}
                    <button
                        className="minimal-button-primary"
                        style={{ fontSize: '13px', padding: '8px 24px' }}
                        onClick={handleNext}
                        disabled={isTargetMissing}
                    >
                        {currentStep === steps.length - 1 ? '¡Listo!' : 'Siguiente'}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Tour;
