import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, SvgTemplate } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import '../src/styles/minimal.css';

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
  const creationId = searchParams.get('creation'); // NEW: Get creation ID for editing
  const { user } = useAuth();

  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>("#4ECDC4");
  const [history, setHistory] = useState<ImageData[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [template, setTemplate] = useState<SvgTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  // Pan/Drag state
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Mobile picker
  const [showPicker, setShowPicker] = useState(false);

  // Palette colors
  const palette = [
    "#13eca4", "#FF6B6B", "#4ECDC4", "#FFE66D",
    "#1A535C", "#FF9F1C", "#2E2F3E", "#FFFFFF",
    "#6A0572", "#AB83A1"
  ];

  // Load template
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

  // Initialize canvas - Load existing creation or blank template
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || loading) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const size = 1000;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, size, size);

    // If editing an existing creation, load it
    if (creationId) {
      loadExistingCreation(canvas, ctx, size);
    } else if (template?.svg_content) {
      // Load blank template
      loadBlankTemplate(canvas, ctx, size);
    }
  }, [template, loading, creationId]);

  // Load existing colored creation
  const loadExistingCreation = async (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, size: number) => {
    try {
      const { data, error } = await supabase
        .from('user_creations')
        .select('colored_svg')
        .eq('id', creationId)
        .single();

      if (error) throw error;

      if (data?.colored_svg) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          const initialData = ctx.getImageData(0, 0, size, size);
          setHistory([initialData]);
        };
        img.src = data.colored_svg;
      }
    } catch (error) {
      console.error('Error loading creation:', error);
      // Fallback to blank template if loading fails
      if (template?.svg_content) {
        loadBlankTemplate(canvas, ctx, size);
      }
    }
  };

  // Load blank SVG template
  const loadBlankTemplate = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, size: number) => {
    if (!template?.svg_content) return;

    const blob = new Blob([template.svg_content], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const aspectRatio = img.width / img.height;
      let drawWidth = size;
      let drawHeight = size;
      if (aspectRatio > 1) {
        drawHeight = size / aspectRatio;
      } else {
        drawWidth = size * aspectRatio;
      }

      const x = (size - drawWidth) / 2;
      const y = (size - drawHeight) / 2;

      ctx.drawImage(img, x, y, drawWidth, drawHeight);
      URL.revokeObjectURL(url);

      const initialData = ctx.getImageData(0, 0, size, size);
      setHistory([initialData]);
    };

    img.src = url;
  };

  // Flood Fill
  const floodFill = (startX: number, startY: number, fillColorHex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;

    const getPixelIndex = (x: number, y: number) => (y * w + x) * 4;

    const startIdx = getPixelIndex(startX, startY);
    const targetR = data[startIdx];
    const targetG = data[startIdx + 1];
    const targetB = data[startIdx + 2];

    if (targetR < 50 && targetG < 50 && targetB < 50) return;

    const { r: fillR, g: fillG, b: fillB } = hexToRgb(fillColorHex);

    if (targetR === fillR && targetG === fillG && targetB === fillB) return;

    const tolerance = 50;

    const matchStartColor = (idx: number) => {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
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
      data[idx + 3] = 255;
    };

    const queue: [number, number][] = [[startX, startY]];
    const visited = new Uint8Array(w * h);

    while (queue.length > 0) {
      const [x, y] = queue.pop()!;
      const idx = getPixelIndex(x, y);

      if (visited[y * w + x]) continue;

      if (matchStartColor(idx)) {
        colorPixel(idx);
        visited[y * w + x] = 1;

        if (x > 0) queue.push([x - 1, y]);
        if (x < w - 1) queue.push([x + 1, y]);
        if (y > 0) queue.push([x, y - 1]);
        if (y < h - 1) queue.push([x, y + 1]);
      }
    }

    ctx.putImageData(imageData, 0, 0);

    setHistory(prev => {
      const newHist = [...prev, imageData];
      if (newHist.length > 10) newHist.shift();
      return newHist;
    });
  };

  // Canvas interaction
  const handleCanvasInteraction = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing) return;
    setIsDrawing(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      e.preventDefault();
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);

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

  // Pan handlers
  const handlePanStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (zoom <= 100) return;

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

  // Save to gallery
  const handleSaveToGallery = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !user || !template || !templateId) {
      navigate('/gallery');
      return;
    }

    const dataUrl = canvas.toDataURL('image/png');

    try {
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

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-secondary)',
      fontFamily: 'var(--font-primary)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--color-bg-primary)',
        borderBottom: '1px solid var(--color-border-light)',
        padding: '16px 20px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => navigate('/')}
              className="minimal-button-secondary"
              style={{
                width: '40px',
                height: '40px',
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
            </button>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              margin: 0
            }}>
              {loading ? 'Cargando...' : template?.title || 'Colorear'}
            </h1>
          </div>

          <button
            onClick={handleSaveToGallery}
            className="minimal-button-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>collections</span>
            <span className="hidden-mobile">Mis Obras</span>
          </button>
        </div>
      </header>

      {/* Main */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden'
      }}>
        {/* Canvas */}
        <div
          style={{
            maxWidth: 'min(90vw, 700px)',
            maxHeight: 'min(90vh, 700px)',
            width: 'fit-content',
            background: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            overflow: 'hidden',
            cursor: zoom > 100 ? (isPanning ? 'grabbing' : 'grab') : 'crosshair',
            touchAction: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseDown={handlePanStart}
          onMouseMove={handlePanMove}
          onMouseUp={handlePanEnd}
          onMouseLeave={handlePanEnd}
          onTouchStart={handlePanStart}
          onTouchMove={handlePanMove}
          onTouchEnd={handlePanEnd}
        >
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${zoom / 100}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.2s ease-out'
          }}>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasInteraction}
              onTouchStart={handleCanvasInteraction}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                display: 'block',
                cursor: zoom > 100 ? 'default' : 'crosshair',
                touchAction: 'none',
                WebkitTouchCallout: 'none',
                userSelect: 'none'
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div style={{
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'var(--color-bg-primary)',
          padding: '12px 20px',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-sm)',
          border: '1px solid var(--color-border-light)',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="minimal-button-secondary"
            style={{
              width: '44px',
              height: '44px',
              padding: '10px',
              position: 'relative'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>undo</span>
            {history.length > 1 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '18px',
                height: '18px',
                background: 'var(--color-accent-primary)',
                color: 'white',
                fontSize: '10px',
                fontWeight: 600,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {history.length - 1}
              </span>
            )}
          </button>

          <button
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            className="minimal-button-secondary"
            style={{ width: '40px', height: '40px', padding: '8px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>remove</span>
          </button>

          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            minWidth: '50px',
            textAlign: 'center'
          }}>
            {zoom}%
          </span>

          <button
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            className="minimal-button-secondary"
            style={{ width: '40px', height: '40px', padding: '8px' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
          </button>

          {zoom !== 100 && (
            <button
              onClick={() => setZoom(100)}
              className="minimal-button-secondary"
              style={{
                height: '40px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>refresh</span>
              <span className="hidden-mobile">Reset</span>
            </button>
          )}
        </div>

        {/* Color Palette - Inline */}
        <div style={{
          marginTop: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(10, 1fr)',
          gap: '8px',
          maxWidth: '600px'
        }}>
          {palette.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                background: color,
                border: selectedColor === color ? '3px solid var(--color-accent-primary)' : '2px solid var(--color-border-light)',
                cursor: 'pointer',
                boxShadow: selectedColor === color ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                transition: 'all 0.2s'
              }}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default ScreenColoring;