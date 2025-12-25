# 🎨 FIX CRÍTICO: Coloring No Funciona en Móvil

## Problema
El canvas de colorear NO responde en dispositivos móviles porque solo tiene eventos de mouse, no eventos táctiles.

## Causa
```tsx
// ❌ SOLO FUNCIONA CON MOUSE
<canvas onClick={handleCanvasClick} />

<div
  onMouseDown={handlePanStart}
  onMouseMove={handlePanMove}
  onMouseUp={handlePanEnd}
/>
```

## Solución Requerida

Necesitamos agregar eventos táctiles paralelos a todos los eventos de mouse:

### 1. Canvas Click (Colorear)
```tsx
// Función unificada que funciona con mouse Y touch
const handleCanvasInteraction = (e: React.MouseEvent | React.TouchEvent) => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  let clientX, clientY;
  
  // Detectar si es touch o mouse
  if ('touches' in e) {
    // Touch event
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else {
    // Mouse event
    clientX = e.clientX;
    clientY = e.clientY;
  }

  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left) * (canvas.width / rect.width);
  const y = (clientY - rect.top) * (canvas.height / rect.height);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Flood fill logic aquí...
};

// Aplicar a ambos eventos:
<canvas
  onClick={handleCanvasInteraction}
  onTouchStart={handleCanvasInteraction}
/>
```

### 2. Pan/Zoom (Arrastrar cuando está zoom)
```tsx
const handlePanStart = (e: React.MouseEvent | React.TouchEvent) => {
  if (zoom <= 100) return;
  
  let clientX, clientY;
  if ('touches' in e) {
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

  let clientX, clientY;
  if ('touches' in e) {
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

// Aplicar:
<div
  onMouseDown={handlePanStart}
  onMouseMove={handlePanMove}
  onMouseUp={handlePanEnd}
  onMouseLeave={handlePanEnd}
  // Agregar touch events:
  onTouchStart={handlePanStart}
  onTouchMove={handlePanMove}
  onTouchEnd={handlePanEnd}
/>
```

### 3. Prevenir Scroll en Móvil

Agregar al container del canvas:

```tsx
<div
  style={{
    touchAction: 'none', // Previene scroll nativo
    WebkitTouchCallout: 'none', // Previene menú contextual iOS
    userSelect: 'none' // Previene selección de texto
  }}
>
```

## TypeScript Types

Actualizar las firmas de funciones:

```tsx
type PointerEvent = React.MouseEvent | React.TouchEvent;

const handleCanvasInteraction = (e: PointerEvent) => { ... };
const handlePanStart = (e: PointerEvent) => { ... };
const handlePanMove = (e: PointerEvent) => { ... };
```

## Implementación Completa Necesaria

Modificar `screens/Coloring.tsx`:

1. **Líneas 200-300:** Actualizar `handleCanvasClick` para soportar touch
2. **Líneas 400-420:** Actualizar `handlePanStart`, `handlePanMove`, `handlePanEnd`
3. **Línea 535:** Agregar `onTouchStart={handleCanvasInteraction}` al canvas
4. **Líneas 520-523:** Agregar `onTouchStart/Move/End` al container

## Testing

Para verificar que funciona:
1. Abre DevTools
2. Toggle device toolbar (móvil)
3. Intenta tocar el canvas para colorear
4. Intenta hacer zoom y pan
5. Verifica que los controles sean clickeables

## Referencias

- [MDN: Touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [React: Touch Events](https://react.dev/reference/react-dom/components/common#touch-events)

---

**Prioridad:** 🔴 CRÍTICA - Sin esto, la app no funciona en móvil
**Estimación:** ~30 minutos de desarrollo + testing
