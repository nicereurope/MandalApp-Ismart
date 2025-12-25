import React, { useState, useRef, useEffect } from 'react';

interface AdvancedColorPickerProps {
    selectedColor: string;
    onColorChange: (color: string) => void;
    onEraser: () => void;
}

const AdvancedColorPicker: React.FC<AdvancedColorPickerProps> = ({
    selectedColor,
    onColorChange,
    onEraser,
}) => {
    const [hue, setHue] = useState(180);
    const [saturation, setSaturation] = useState(50);
    const [lightness, setLightness] = useState(50);
    const [isEraser, setIsEraser] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);
    const isInternalChange = useRef(false);
    const isInitialized = useRef(false);

    // Convert HSL to Hex
    const hslToHex = (h: number, s: number, l: number): string => {
        l /= 100;
        const a = (s * Math.min(l, 1 - l)) / 100;
        const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color)
                .toString(16)
                .padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    };

    // Convert Hex to HSL
    const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return { h: 0, s: 0, l: 0 };

        let r = parseInt(result[1], 16) / 255;
        let g = parseInt(result[2], 16) / 255;
        let b = parseInt(result[3], 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0,
            s = 0,
            l = (max + min) / 2;

        if (max !== min) {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                    break;
                case g:
                    h = ((b - r) / d + 2) / 6;
                    break;
                case b:
                    h = ((r - g) / d + 4) / 6;
                    break;
            }
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100),
        };
    };

    // Update HSL when selectedColor changes externally (from parent)
    useEffect(() => {
        if (isInternalChange.current) {
            isInternalChange.current = false;
            return;
        }

        if (selectedColor && selectedColor !== 'transparent') {
            const hsl = hexToHsl(selectedColor);
            setHue(hsl.h);
            setSaturation(hsl.s);
            setLightness(hsl.l);
            setIsEraser(false);
        } else {
            setIsEraser(true);
        }
    }, [selectedColor]);

    // Update color when HSL changes (internal changes)
    useEffect(() => {
        // Skip on initial mount
        if (!isInitialized.current) {
            isInitialized.current = true;
            return;
        }

        if (!isEraser) {
            const newColor = hslToHex(hue, saturation, lightness);
            isInternalChange.current = true;
            onColorChange(newColor);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hue, saturation, lightness, isEraser]);

    const handlePickerClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!pickerRef.current) return;
        const rect = pickerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const newSat = Math.round((x / rect.width) * 100);
        const newLight = Math.round(100 - (y / rect.height) * 100);
        setSaturation(Math.max(0, Math.min(100, newSat)));
        setLightness(Math.max(0, Math.min(100, newLight)));
        setIsEraser(false);
    };

    const handleEraserClick = () => {
        setIsEraser(true);
        onEraser();
    };

    return (
        <div className="space-y-4">
            {/* 2D Picker */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    Color Picker
                </label>
                <div
                    ref={pickerRef}
                    onClick={handlePickerClick}
                    className="relative w-full h-48 rounded-xl cursor-crosshair shadow-inner border-2 border-slate-200 dark:border-slate-700 overflow-hidden"
                    style={{
                        background: `
              linear-gradient(to top, black, transparent),
              linear-gradient(to right, white, hsl(${hue}, 100%, 50%))
            `,
                    }}
                >
                    {!isEraser && (
                        <div
                            className="absolute w-5 h-5 border-3 border-white rounded-full shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                            style={{
                                left: `${saturation}%`,
                                top: `${100 - lightness}%`,
                                boxShadow: '0 0 8px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(0,0,0,0.3)',
                            }}
                        />
                    )}
                </div>
            </div>

            {/* Hue Slider */}
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Tono
                </label>
                <div className="relative h-8 rounded-lg overflow-hidden shadow-inner">
                    <input
                        type="range"
                        min="0"
                        max="360"
                        value={hue}
                        onChange={(e) => {
                            setHue(parseInt(e.target.value));
                            setIsEraser(false);
                        }}
                        className="hue-slider w-full h-full appearance-none bg-transparent cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, 
                hsl(0, 100%, 50%), 
                hsl(60, 100%, 50%), 
                hsl(120, 100%, 50%), 
                hsl(180, 100%, 50%), 
                hsl(240, 100%, 50%), 
                hsl(300, 100%, 50%), 
                hsl(360, 100%, 50%)
              )`,
                        }}
                    />
                </div>
            </div>

            {/* Color Display & Hex Input */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10">
                <div
                    className="w-14 h-14 rounded-lg shadow-md border-2 border-white dark:border-slate-600 flex-shrink-0"
                    style={{
                        backgroundColor: isEraser ? 'transparent' : selectedColor,
                        backgroundImage: isEraser
                            ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                            : 'none',
                        backgroundSize: isEraser ? '10px 10px' : 'auto',
                        backgroundPosition: isEraser ? '0 0, 0 5px, 5px -5px, -5px 0px' : '0 0',
                    }}
                />
                <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase block mb-1">
                        Código Hex
                    </label>
                    <input
                        type="text"
                        value={isEraser ? 'Borrador' : selectedColor.toUpperCase()}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (/^#[0-9A-F]{6}$/i.test(value)) {
                                onColorChange(value);
                                setIsEraser(false);
                            }
                        }}
                        className="w-full px-3 py-2 text-sm font-mono font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-s2-primary"
                        placeholder="#4ECDC4"
                        disabled={isEraser}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                    onClick={handleEraserClick}
                    className={`flex items-center justify-center gap-2 h-12 rounded-xl font-bold text-sm transition-all ${isEraser
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 border border-slate-200 dark:border-slate-700'
                        }`}
                >
                    <span className="material-symbols-outlined text-xl">
                        {isEraser ? 'check_circle' : 'format_color_reset'}
                    </span>
                    Borrar
                </button>
                <button
                    onClick={() => {
                        setHue(180);
                        setSaturation(70);
                        setLightness(60);
                        setIsEraser(false);
                    }}
                    className="flex items-center justify-center gap-2 h-12 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-slate-700 font-bold text-sm transition-all"
                >
                    <span className="material-symbols-outlined text-xl">restart_alt</span>
                    Reset
                </button>
            </div>

            <style>{`
        .hue-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 24px;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 0 0 2px rgba(0, 0, 0, 0.1);
          border: 2px solid rgba(0, 0, 0, 0.2);
        }

        .hue-slider::-moz-range-thumb {
          width: 14px;
          height: 24px;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3), inset 0 0 0 2px rgba(0, 0, 0, 0.1);
          border: 2px solid rgba(0, 0, 0, 0.2);
        }

        .hue-slider::-webkit-slider-runnable-track {
          height: 32px;
          border-radius: 8px;
        }

        .hue-slider::-moz-range-track {
          height: 32px;
          border-radius: 8px;
        }
      `}</style>
        </div>
    );
};

export default AdvancedColorPicker;
