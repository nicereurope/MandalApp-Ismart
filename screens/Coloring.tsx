import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdvancedColorPicker from '../components/AdvancedColorPicker';
import { supabase, SvgTemplate } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// Utility: Convert hex to {r,g,b}
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const ScreenColoring: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');
  const { user } = useAuth();

  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#4ECDC4"); // Default teal
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [template, setTemplate] = useState<SvgTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  // Pan/Drag state
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Auto-save indicator
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load template from Supabase
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('svg_templates')
          .select('*')
          .eq('id', templateId)
          .single();

        if (error) throw error;
        setTemplate(data);
      } catch (error) {
        console.error('Error loading template:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [templateId]);

  // Palette colors
  const palette = [
    { color: "#13eca4", name: "Fresh Teal" },
    { color: "#FF6B6B", name: "Coral Red" },
    { color: "#4ECDC4", name: "Calm Turquoise" },
    { color: "#FFE66D", name: "Sunny Yellow" },
    { color: "#1A535C", name: "Deep Ocean" },
    { color: "#FF9F1C", name: "Vibrant Orange" },
    { color: "#2E2F3E", name: "Midnight" },
    { color: "#FFFFFF", name: "Eraser" },
    { color: "#6A0572", name: "Royal Purple" },
    { color: "#AB83A1", name: "Dusty Rose" },
  ];

  // Draw the initial Mandala
  const drawMandala = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    ctx.strokeStyle = "#1A1A1A";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const cx = width / 2;
    const cy = height / 2;

    // Outer Circle
    ctx.beginPath();
    ctx.arc(cx, cy, 380, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Pattern 1
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      const angle = (i * 30 * Math.PI) / 180;
      ctx.moveTo(cx, cy);
      ctx.quadraticCurveTo(
        cx + Math.cos(angle + 0.2) * 200,
        cy + Math.sin(angle + 0.2) * 200,
        cx + Math.cos(angle) * 380,
        cy + Math.sin(angle) * 380
      );
      ctx.stroke();
    }

    // Circles
    [50, 100, 180, 260].forEach(r => {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Petals Center
    for (let i = 0; i < 8; i++) {
      const angle = (i * 45 * Math.PI) / 180;
      const nextAngle = ((i + 1) * 45 * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 50, cy + Math.sin(angle) * 50);
      ctx.bezierCurveTo(
        cx + Math.cos(angle) * 120, cy + Math.sin(angle) * 120,
        cx + Math.cos(nextAngle) * 120, cy + Math.sin(nextAngle) * 120,
        cx + Math.cos(nextAngle) * 50, cy + Math.sin(nextAngle) * 50
      );
      ctx.stroke();
    }
  }, []);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || loading) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Try to load saved progress from localStorage
    const savedKey = `coloring_progress_${templateId || 'default'}`;
    const savedProgress = localStorage.getItem(savedKey);

    // If we have a template, render its SVG with proper aspect ratio
    if (template && template.svg_content) {
      // Parse SVG to get viewBox
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(template.svg_content, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');

      let width = 1000;
      let height = 1000;

      if (svgElement) {
        const viewBox = svgElement.getAttribute('viewBox');
        if (viewBox) {
          const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
          const aspectRatio = vbWidth / vbHeight;

          // Set canvas size based on aspect ratio
          if (aspectRatio > 1) {
            // Wider than tall
            width = 1000;
            height = 1000 / aspectRatio;
          } else {
            // Taller than wide
            height = 1000;
            width = 1000 * aspectRatio;
          }
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, width, height);

      if (savedProgress) {
        // Load saved progress
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          const initialData = ctx.getImageData(0, 0, width, height);
          setHistory([initialData]);
        };
        img.src = savedProgress;
      } else {
        // Load fresh SVG
        const img = new Image();
        const svgBlob = new Blob([template.svg_content], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          ctx.drawImage(img, 0, 0, width, height);
          URL.revokeObjectURL(url);

          // Save initial state to history
          const initialData = ctx.getImageData(0, 0, width, height);
          setHistory([initialData]);
        };

        img.src = url;
      }
    } else {
      // Fallback to drawing the default mandala (square)
      const size = 1000;
      canvas.width = size;
      canvas.height = size;

      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, size, size);

      if (savedProgress) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          const initialData = ctx.getImageData(0, 0, size, size);
          setHistory([initialData]);
        };
        img.src = savedProgress;
      } else {
        drawMandala(ctx, size, size);

        // Save initial state to history
        const initialData = ctx.getImageData(0, 0, size, size);
        setHistory([initialData]);
      }
    }
  }, [template, loading, drawMandala, templateId]);

  // Auto-save canvas to localStorage when it changes
  useEffect(() => {
    if (history.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setAutoSaveStatus('saving');

    // Debounce save to avoid excessive localStorage writes
    const timeoutId = setTimeout(async () => {
      const savedKey = `coloring_progress_${templateId || 'default'}`;
      const dataUrl = canvas.toDataURL('image/png');

      try {
        localStorage.setItem(savedKey, dataUrl);
        setAutoSaveStatus('saved');

        // Hide "saved" indicator after 2 seconds
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'QuotaExceededError') {
          // localStorage is full
          console.error('localStorage quota exceeded');
          setAutoSaveStatus('idle');

          // Show alert to user
          alert('⚠️ Espacio de almacenamiento lleno\n\nNo se puede guardar automáticamente. Por favor:\n1. Ve a Gallery y elimina dibujos antiguos\n2. O guarda tu dibujo actual presionando "Save Art"');
        } else {
          console.error('Error saving to localStorage:', error);
          setAutoSaveStatus('idle');
        }
      }
    }, 500); // Wait 500ms after last change before saving

    return () => clearTimeout(timeoutId);
  }, [history, templateId]);

  // Note: Auto-save to Supabase disabled to allow multiple versions
  // Works are saved when user clicks "Mis Obras" button
  // This allows creating multiple colored versions of the same template

  // Flood Fill Algorithm
  const floodFill = (startX: number, startY: number, fillColorHex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Get image data
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    // Helper to get pixel index
    const getPixelIndex = (x: number, y: number) => (y * w + x) * 4;

    // Target color
    const startIdx = getPixelIndex(startX, startY);
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];
    const targetA = data[startIdx + 3];

    // Don't fill if clicking on a line (black-ish)
    if (targetR < 50 && targetG < 50 && targetB < 50) return;

    // Convert fill color
    const { r: fillR, g: fillG, b: fillB } = hexToRgb(fillColorHex);

    // If color is same, return
    if (targetR === fillR && targetG === fillG && targetB === fillB && targetA === 255) return;

    const tolerance = 50; // Tolerance for anti-aliasing

    const matchStartColor = (idx: number) => {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      // Simple distance check
      return (
        Math.abs(r - targetR) < tolerance &&
        Math.abs(g - targetG) < tolerance &&
        Math.abs(b - targetB) < tolerance
      );
    };

    const colorPixel = (idx: number) => {
      data[idx] = fillR;
      data[idx + 1] = fillG;
      data[idx + 2] = fillB;
      data[idx + 3] = 255; // Alpha
    };

    // BFS Queue
    const queue: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(w * h); // track visited pixels

    while (queue.length > 0) {
      const [x, y] = queue.pop()!;
      const idx = getPixelIndex(x, y);

      if (visited[y * w + x]) continue;

      // Check color match
      if (matchStartColor(idx)) {
        colorPixel(idx);
        visited[y * w + x] = 1;

        // Push neighbors
        if (x > 0) queue.push([x - 1, y]);
        if (x < w - 1) queue.push([x + 1, y]);
        if (y > 0) queue.push([x, y - 1]);
        if (y < h - 1) queue.push([x, y + 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);

    // Add to history
    setHistory(prev => {
      const newHist = [...prev, imageData];
      if (newHist.length > 10) newHist.shift(); // Limit history
      return newHist;
    });
  };

  // Unified handler for both mouse and touch events
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing) return;
    setIsDrawing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get coordinates from either mouse or touch event
    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault(); // Prevent scrolling
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);

    // Run flood fill in a timeout to allow UI to update if needed
    setTimeout(() => {
      floodFill(x, y, selectedColor);
      setIsDrawing(false);
    }, 0);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const prevState = history[history.length - 2];
    ctx.putImageData(prevState, 0, 0);
    setHistory(prev => prev.slice(0, -1));
  };

  // Pan handlers - unified for mouse and touch
  const handlePanStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (zoom <= 100) return; // Only pan if zoomed in
    if ((e.target as HTMLElement).tagName === 'CANVAS') return; // Let canvas handle clicks

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    setIsPanning(true);
    setPanStart({ x: clientX - panOffset.x, y: clientY - panOffset.y });
  };

  const handlePanMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPanning) return;

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    setPanOffset({
      x: clientX - panStart.x,
      y: clientY - panStart.y
    });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
  };

  // Save to gallery when navigating to "Mis Obras"
  const handleSaveToGallery = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !user || !template || !templateId) {
      navigate('/gallery');
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');

    try {
      // Always INSERT to allow multiple versions
      const { error } = await supabase
        .from('user_creations')
        .insert({
          user_id: user.id,
          template_id: templateId,
          title: template.title,
          colored_svg: dataUrl,
        });

      if (error) {
        console.error('Error saving to gallery:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    navigate('/gallery');
  };

  // Mobile color picker drawer
  const [isMobilePickerOpen, setIsMobilePickerOpen] = useState(false);

  return (
    <div className="bg-s2-background-light dark:bg-s2-background-dark font-display text-slate-800 dark:text-slate-200 overflow-hidden h-screen flex flex-col selection:bg-s2-primary/30">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] opacity-[0.03] bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuBP2pMcVwKvRh7vdOveVbBrM3_LRZ9Pxc9sv26N2x__P-s81MIujZF7CvDjZT_5pjQ86TcOutfk_1gfMzJDHzH6CmW_tAzKenXxXbayxUFCQVKJC9BoNOTE23sO9t6dANNpFFvWFbBWxWncccAI8U6JGEvdQdt5He4pdx5mxYliosPN5oVXenTpamNKFKIiuTi2xUak33uWzI5QPatpzfhqnf7AyifkfTNXrIhOBY11skto5Gr3bowEXEynCFOkgChdqkw3cGBaiU4')]"></div>

      <header className="h-20 shrink-0 flex items-center justify-between px-6 md:px-8 bg-s2-surface-light/80 dark:bg-s2-surface-dark/80 backdrop-blur-md z-30 transition-all border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate('/')} aria-label="Go Back" className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors focus:ring-2 ring-s2-primary group">
            <span className="material-symbols-outlined text-3xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-handwritten font-bold leading-tight tracking-wide text-slate-900 dark:text-white transform -rotate-1 origin-left">
              {loading ? 'Cargando...' : template?.title || 'Forest Whisper'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5 tracking-wide">
              By Ismael Gudiño
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* Auto-save indicator */}
          {autoSaveStatus !== 'idle' && (
            <span className={`hidden md:inline-flex text-sm items-center gap-2 mr-2 select-none font-medium transition-all ${autoSaveStatus === 'saving' ? 'text-amber-500' : 'text-green-600'
              }`}>
              {autoSaveStatus === 'saving' ? (
                <>
                  <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                  Guardando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                  Guardado ✓
                </>
              )}
            </span>
          )}
          <button
            onClick={handleSaveToGallery}
            className="flex items-center gap-2 justify-center h-11 px-8 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transition-all organic-border transform hover:-rotate-1 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">collections</span>
            Mis Obras
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <main className="flex-1 relative bg-s2-background-light dark:bg-s2-background-dark flex flex-col items-center justify-center overflow-hidden pattern-dot">
          <div className="absolute top-6 left-6 z-20">
            <button className="group flex items-center gap-3 p-2 pr-5 rounded-full bg-white/90 dark:bg-s2-surface-dark/90 shadow-organic hover:shadow-organic-hover border border-white/20 dark:border-white/5 text-slate-600 dark:text-slate-300 hover:text-s2-primary transition-all h-14 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-s2-primary/10 transition-colors">
                <span className="material-symbols-outlined text-xl">visibility</span>
              </div>
              <span className="font-handwritten text-lg font-bold">Original</span>
            </button>
          </div>

          {/* Canvas Container */}
          <div
            className="relative bg-white shadow-2xl shadow-slate-200/50 dark:shadow-black/50 transition-transform duration-200 ease-out overflow-hidden ring-8 ring-white dark:ring-s2-surface-dark organic-border"
            style={{
              width: 'min(90%, 80vh)',
              aspectRatio: '1/1',
              cursor: zoom > 100 ? (isPanning ? 'grabbing' : 'grab') : 'crosshair',
              touchAction: 'none' // Prevent scrolling on touch
            }}
            onMouseDown={handlePanStart}
            onMouseMove={handlePanMove}
            onMouseUp={handlePanEnd}
            onMouseLeave={handlePanEnd}
            onTouchStart={handlePanStart}
            onTouchMove={handlePanMove}
            onTouchEnd={handlePanEnd}
          >
            <div
              className="w-full h-full relative flex items-center justify-center"
              style={{
                transform: `scale(${zoom / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`,
                transformOrigin: 'center center',
                transition: isPanning ? 'none' : 'transform 0.2s ease-out'
              }}
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasInteraction}
                onTouchStart={handleCanvasInteraction}
                className="max-w-full max-h-full object-contain"
                style={{
                  display: 'block',
                  cursor: zoom > 100 ? 'default' : 'crosshair',
                  touchAction: 'none', // Prevent scroll on touch
                  WebkitTouchCallout: 'none', // Prevent iOS context menu
                  userSelect: 'none' // Prevent text selection
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <div className="flex items-center gap-3 p-2.5 rounded-full bg-white/80 dark:bg-s2-surface-dark/80 backdrop-blur-xl shadow-organic border border-white/40 dark:border-white/5">
              <button
                onClick={handleUndo}
                disabled={history.length <= 1}
                className="group relative w-14 h-14 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                title={`Deshacer (${history.length - 1} disponibles)`}
              >
                <span className="material-symbols-outlined text-[28px]">undo</span>
                {history.length > 1 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-s2-primary text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                    {history.length - 1}
                  </span>
                )}
              </button>
              <button className="w-14 h-14 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90" title="Zoom Out" onClick={() => setZoom(Math.max(50, zoom - 10))}>
                <span className="material-symbols-outlined text-[28px]">remove</span>
              </button>
              <span className="text-lg font-handwritten font-bold text-slate-700 dark:text-slate-200 w-16 text-center select-none pt-1">{zoom}%</span>
              <button className="w-14 h-14 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all active:scale-90" title="Zoom In" onClick={() => setZoom(Math.min(200, zoom + 10))}>
                <span className="material-symbols-outlined text-[28px]">add</span>
              </button>
              <div className="w-px h-8 bg-slate-200 dark:bg-white/10 mx-1"></div>
              <button className="w-14 h-14 flex items-center justify-center rounded-full text-s2-primary hover:bg-s2-primary/10 transition-colors active:scale-90" title="Reset View" onClick={() => setZoom(100)}>
                <span className="material-symbols-outlined text-[28px]">filter_center_focus</span>
              </button>
            </div>
          </div>
        </main>

        {/* Sidebar Palette */}
        <aside className="w-[400px] shrink-0 bg-white dark:bg-s2-surface-dark border-l border-slate-100 dark:border-slate-800 flex flex-col z-20 shadow-xl relative hidden lg:flex">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-s2-primary via-s2-accent-pink to-s2-accent-yellow opacity-50"></div>
          <div className="p-6 pb-4 border-b border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-white/5 backdrop-blur-sm">
            <h2 className="font-handwritten font-bold text-2xl dark:text-white tracking-wide transform -rotate-1">Color Studio</h2>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-s2-primary/10 text-s2-primary-dark dark:text-s2-primary">
              <span className="material-symbols-outlined text-lg">history</span>
              <span className="text-sm font-bold">{history.length}</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Advanced Color Picker */}
            <AdvancedColorPicker
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              onEraser={() => setSelectedColor('transparent')}
            />

            {/* Quick Palette */}
            <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-s2-primary animate-pulse"></span>
                  Paleta Rápida
                </h3>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {palette.map((p) => (
                  <button
                    key={p.color}
                    onClick={() => setSelectedColor(p.color)}
                    aria-label={`Select color ${p.name}`}
                    className="group relative w-full aspect-square transition-transform hover:scale-110 active:scale-90 focus:outline-none"
                    title={p.name}
                  >
                    <span
                      className="absolute inset-0 rounded-xl shadow-sm transition-all duration-300"
                      style={{
                        backgroundColor: p.color,
                        boxShadow: selectedColor === p.color ? `0 0 15px ${p.color}80` : 'none',
                        transform: selectedColor === p.color ? 'scale(1.1)' : 'scale(1)'
                      }}
                    ></span>
                    {selectedColor === p.color && (
                      <span className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity z-10">
                        <span className={`material-symbols-outlined text-lg font-bold ${p.color === '#FFFFFF' ? 'text-black' : 'text-white'} drop-shadow-md`}>check</span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* History Info */}
            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-sm text-slate-500 dark:text-slate-400">Historial</h4>
                <span className="text-xs px-3 py-1 rounded-full bg-s2-primary/10 text-s2-primary-dark dark:text-s2-primary font-bold">
                  {history.length} {history.length === 1 ? 'paso' : 'pasos'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Usa el botón "Deshacer" para volver atrás hasta {Math.min(10, history.length)} pasos
              </p>
            </div>
          </div>
        </aside>

        {/* Mobile Gallery Button */}
        <button
          onClick={handleSaveToGallery}
          className="lg:hidden fixed bottom-44 right-6 z-30 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-transform"
          aria-label="Mis Obras"
        >
          <span className="material-symbols-outlined text-3xl">collections</span>
        </button>

        {/* Mobile Color Picker Button */}
        <button
          onClick={() => setIsMobilePickerOpen(true)}
          className="lg:hidden fixed bottom-24 right-6 z-30 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-br from-s2-primary to-s2-accent-pink text-white shadow-2xl shadow-s2-primary/40 hover:scale-110 active:scale-95 transition-transform"
          aria-label="Open Color Picker"
        >
          <span className="material-symbols-outlined text-3xl">palette</span>
        </button>

        {/* Mobile Color Picker Drawer */}
        {isMobilePickerOpen && (
          <>
            {/* Overlay */}
            <div
              className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setIsMobilePickerOpen(false)}
            />

            {/* Drawer */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-s2-surface-dark rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden animate-slide-up">
              {/* Header */}
              <div className="p-4 pb-3 border-b border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-white/5">
                <h2 className="font-handwritten font-bold text-2xl dark:text-white tracking-wide transform -rotate-1">Color Studio</h2>
                <button
                  onClick={() => setIsMobilePickerOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
                >
                  <span className="material-symbols-outlined text-2xl">close</span>
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto p-6 space-y-6 custom-scrollbar max-h-[calc(85vh-70px)]">
                {/* Advanced Color Picker */}
                <AdvancedColorPicker
                  selectedColor={selectedColor}
                  onColorChange={(color) => {
                    setSelectedColor(color);
                  }}
                  onEraser={() => setSelectedColor('transparent')}
                />

                {/* Quick Palette */}
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-s2-primary animate-pulse"></span>
                      Paleta Rápida
                    </h3>
                  </div>
                  <div className="grid grid-cols-5 gap-3">
                    {palette.map((p) => (
                      <button
                        key={p.color}
                        onClick={() => {
                          setSelectedColor(p.color);
                          setIsMobilePickerOpen(false);
                        }}
                        aria-label={`Select color ${p.name}`}
                        className="group relative w-full aspect-square transition-transform hover:scale-110 active:scale-90 focus:outline-none"
                        title={p.name}
                      >
                        <span
                          className="absolute inset-0 rounded-xl shadow-sm transition-all duration-300"
                          style={{
                            backgroundColor: p.color,
                            boxShadow: selectedColor === p.color ? `0 0 15px ${p.color}80` : 'none',
                            transform: selectedColor === p.color ? 'scale(1.1)' : 'scale(1)'
                          }}
                        ></span>
                        {selectedColor === p.color && (
                          <span className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity z-10">
                            <span className={`material-symbols-outlined text-lg font-bold ${p.color === '#FFFFFF' ? 'text-black' : 'text-white'} drop-shadow-md`}>check</span>
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ScreenColoring;