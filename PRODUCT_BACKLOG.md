# 📋 MandalApp-Ismart - Product Backlog

**Última actualización:** 2025-12-24  
**Versión actual:** 1.0 (MVP en producción)

---

## 🎯 Visión del Producto

Una aplicación web de terapia artística que permite a los usuarios colorear mandalas y dibujos personalizados, con funcionalidades de guardado, compartición y administración de plantillas.

---

## 📊 Clasificación de Tareas

- 🔴 **Crítico** - Bugs que afectan funcionalidad core
- 🟠 **Alto** - Mejoras importantes de UX/funcionalidad
- 🟡 **Medio** - Mejoras deseables
- 🟢 **Bajo** - Nice to have
- 💡 **Idea** - Para explorar

---

## 🔴 CRÍTICO - Bugs y Problemas de Funcionalidad

### BUG-001: Gallery no guarda creaciones en Supabase
**Priority:** 🔴 Crítica  
**Status:** 🚫 Pendiente  
**Descripción:**  
- La pantalla Gallery está lista pero no se guardan las creaciones al presionar "Save Art"
- El botón en Coloring.tsx solo navega a Completion, no guarda en DB

**Pasos a Reproducir:**
1. Colorear un dibujo
2. Click "Save Art"
3. Ir a Gallery
4. No aparece ninguna creación

**Solución Esperada:**
- Modificar el handler de "Save Art" para insertar en `user_creations`
- Guardar: user_id, template_id, title, colored_svg, canvas dataURL

**Archivos Afectados:**
- `screens/Coloring.tsx` (líneas 350-362)
- `screens/Gallery.tsx` (verificar integración)

**Estimación:** 2-3 horas

---

### BUG-002: Botón "Sorpréndeme" no funciona
**Priority:** 🔴 Alta  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Botón flotante "¡Sorpréndeme!" en Home navega a `/coloring` sin template ID
- Debería seleccionar una plantilla aleatoria

**Ubicación:** `screens/Home.tsx` (línea 163)

**Solución Esperada:**
```tsx
onClick={() => {
  const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
  if (randomTemplate) {
    navigate(`/coloring?template=${randomTemplate.id}`);
  }
}}
```

**Estimación:** 30 minutos

---

### BUG-003: Settings no tiene funcionalidad real
**Priority:** 🟠 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- La pantalla Settings existe pero es solo placeholder
- No hay settings reales implementados

**Ubicación:** `screens/Settings.tsx`

**Opciones a Implementar:**
1. Dark/Light mode toggle (ya existe en diseño)
2. Idioma (ES/EN)
3. Calidad de guardado (PNG quality)
4. Borrar localStorage
5. Desvincular cuenta

**Estimación:** 4-6 horas

---

## 🟠 ALTO - Mejoras Importantes de UX

### UX-001: Indicador visual de auto-guardado
**Priority:** 🟠 Alta  
**Status:** 🚫 Pendiente  
**Descripción:**  
- El auto-guardado funciona pero es invisible al usuario
- Genera incertidumbre

**Solución Esperada:**
- Toast notification "Guardado automáticamente ✓"
- O icono en header que muestra estado: guardando... / guardado

**Ubicación:** `screens/Coloring.tsx` (añadir después línea 241)

**Estimación:** 1-2 horas

---

### UX-002: Filtros de búsqueda no funcionan
**Priority:** 🟠 Alta  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Home tiene filtros de Dificultad y Ánimo pero no filtran
- Son buttons estáticos

**Ubicación:** `screens/Home.tsx` (líneas 111-138)

**Solución Esperada:**
```tsx
const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);
const filteredTemplates = templates.filter(t => 
  !difficultyFilter || t.difficulty === difficultyFilter
);
```

**Estimación:** 2-3 horas

---

### UX-003: Botón "Deshacer" no tiene límite visual
**Priority:** 🟠 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- History crece infinitamente
- Puede llenar memoria localStorage

**Solución Esperada:**
- Limitar history a 20 pasos
- Mostrar contador visual
- Mensaje cuando llegue al límite

**Ubicación:** `screens/Coloring.tsx` (floodFill function)

**Estimación:** 1 hora

---

### UX-004: No hay feedback al hacer click en áreas sin colorear
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Si clickeas en líneas negras, no pasa nada (correcto)
- Pero no hay feedback visual de que detectó el click

**Solución Esperada:**
- Ripple effect temporal
- O cambio de cursor

**Estimación:** 1-2 horas

---

### UX-005: localStorage puede llenarse sin avisar
**Priority:** 🟠 Alta  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Cada template guardado ocupa ~500KB-2MB
- localStorage tiene límite de 5-10MB
- No hay manejo de excepción

**Solución Esperada:**
```tsx
try {
  localStorage.setItem(key, data);
} catch (e) {
  if (e.name === 'QuotaExceededError') {
    // Mostrar modal: "Espacio lleno, elimina dibujos antiguos"
    // Ofrecer guardar en Supabase
  }
}
```

**Estimación:** 2-3 horas

---

## 🟡 MEDIO - Mejoras Deseables

### FEAT-001: Zoom con gestos móviles
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Mobile no tiene pinch-to-zoom
- Solo botones +/-

**Solución Esperada:**
- Implementar touch handlers para pinch gesture
- Usar hammer.js o similar

**Estimación:** 3-4 horas

---

### FEAT-002: Exportar como JPG además de PNG
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Solo se exporta PNG
- JPG sería más liviano para compartir

**Ubicación:** `screens/Completion.tsx` (download handler)

**Estimación:** 1 hora

---

### FEAT-003: Selector de grosor de línea (eraser)
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- El borrador funciona pero no se puede ajustar grosor
- Útil para correcciones pequeñas

**Ubicación:** `components/AdvancedColorPicker.tsx`

**Estimación:** 2-3 horas

---

### FEAT-004: Preview de color antes de aplicar
**Priority:** 🟡 Baja  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Al hacer hover sobre un área, mostrar preview del color
- Sin aplicar hasta click

**Estimación:** 4-5 horas (complejo)

---

### FEAT-005: Modos de color especiales
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Gradientes
- Patterns (rayas, puntos)
- Texturas

**Estimación:** 8-12 horas (feature grande)

---

### FEAT-006: Templates por categorías
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- El campo `category` existe en DB pero no se usa
- Agregar tabs: Mandalas, Animales, Naturaleza, etc.

**Ubicación:** `screens/Home.tsx`

**Estimación:** 2-3 horas

---

### FEAT-007: Búsqueda por texto
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Input de búsqueda existe pero no funciona (línea 115 Home.tsx)

**Solución:**
```tsx
const [searchTerm, setSearchTerm] = useState('');
const filteredTemplates = templates.filter(t =>
  t.title.toLowerCase().includes(searchTerm.toLowerCase())
);
```

**Estimación:** 1 hora

---

## 🟢 BAJO - Nice to Have

### NICE-001: Paleta de colores recientes
**Priority:** 🟢 Baja  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Guardar últimos 5 colores usados
- Mostrar en quick palette

**Estimación:** 2 horas

---

### NICE-002: Atajos de teclado
**Priority:** 🟢 Baja  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Ctrl+Z: Deshacer
- Ctrl+S: Guardar
- E: Eraser toggle

**Estimación:** 2-3 horas

---

### NICE-003: Tutorial interactivo
**Priority:** 🟢 Baja  
**Status:** 🚫 Pendiente  
**Descripción:**  
- First-time user experience
- Tour guiado con tooltips

**Estimación:** 6-8 horas

---

### NICE-004: Animación al completar
**Priority:** 🟢 Baja  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Confetti cuando guardas
- Animación de "obra maestra"

**Estimación:** 2-3 horas

---

### NICE-005: Temas de color para la app
**Priority:** 🟢 Baja  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Diferentes color schemes
- No solo dark/light

**Estimación:** 4-6 horas

---

## 💡 IDEAS - Para Explorar

### IDEA-001: Modo colaborativo
**Priority:** 💡 Idea  
**Descripción:**  
- Múltiples usuarios coloreando el mismo dibujo
- WebSockets / Supabase Realtime

**Complejidad:** Alta  
**Estimación:** 20-30 horas

---

### IDEA-002: Generador de mandalas con IA
**Priority:** 💡 Idea  
**Descripción:**  
- Integración con Stable Diffusion o DALL-E
- Generar mandalas personalizadas

**Complejidad:** Alta  
**Estimación:** 15-20 horas + costos API

---

### IDEA-003: Galería pública
**Priority:** 💡 Idea  
**Descripción:**  
- Feed de creaciones de todos los usuarios
- Sistema de likes
- Opt-in para privacidad

**Complejidad:** Media  
**Estimación:** 10-15 horas

---

### IDEA-004: Impresión física (integración Printful)
**Priority:** 💡 Idea  
**Descripción:**  
- Imprimir tus dibujos en pósters, camisetas
- Integración con servicio de impresión

**Complejidad:** Media  
**Estimación:** 8-12 horas

---

### IDEA-005: Modos de relajación (música, temporizador)
**Priority:** 💡 Idea  
**Descripción:**  
- Música de fondo relajante
- Temporizador Pomodoro
- Soundscapes

**Complejidad:** Baja  
**Estimación:** 4-6 horas

---

## 🔧 TECH DEBT - Deuda Técnica

### TECH-001: Separar estilos inline a archivos CSS
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Muchos componentes tienen `<style>` inline
- Dificulta mantenimiento

**Archivos:**
- Gallery.tsx
- Admin.tsx
- Settings.tsx

**Estimación:** 4-6 horas

---

### TECH-002: Types incompletos
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Varios `any` en el código
- Falta validación de tipos

**Solución:**
- Agregar types estrictos
- Habilitar `strict: true` en tsconfig

**Estimación:** 3-4 horas

---

### TECH-003: Error handling inconsistente
**Priority:** 🟠 Alta  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Algunos errores se logean solo a console
- Falta UI de error global

**Solución:**
- Error boundary component
- Toast system centralizado

**Estimación:** 4-5 horas

---

### TECH-004: Performance - canvas re-renders
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Canvas se re-dibuja en cada state change
- Podría optimizarse con refs

**Estimación:** 3-4 horas

---

### TECH-005: Tests inexistentes
**Priority:** 🟢 Baja  
**Status:** 🚫 Pendiente  
**Descripción:**  
- 0% test coverage
- No hay unit tests, integration tests, e2e

**Solución:**
- Vitest para unit tests
- Playwright para e2e

**Estimación:** 15-20 horas para setup y tests básicos

---

## 🛡️ SEGURIDAD

### SEC-001: RLS policies en Supabase
**Priority:** 🔴 Crítica  
**Status:** ⚠️ Verificar  
**Descripción:**  
- Verificar que las RLS policies estén activas
- Usuarios solo deben poder:
  - Leer templates activos
  - CRUD sus propias creaciones
  - Admins: full access

**Estimación:** 2-3 horas (audit + fixes)

---

### SEC-002: Input sanitization
**Priority:** 🟠 Alta  
**Status:** 🚫 Pendiente  
**Descripción:**  
- SVG content no se sanitiza antes de guardar
- Riesgo de XSS

**Solución:**
- DOMPurify library
- Sanitizar en admin antes de insert

**Estimación:** 2-3 horas

---

### SEC-003: Rate limiting en uploads
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Admin puede subir infinitos templates
- Riesgo de abuso

**Solución:**
- Rate limiting en Supabase Edge Functions
- O validación client-side temporal

**Estimación:** 3-4 horas

---

## 📈 ANALYTICS & METRICS

### METRIC-001: Tracking de eventos
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- No hay analytics implementado
- Útil para entender uso

**Eventos sugeridos:**
- Template selected
- Color picker opened
- Artwork saved
- Social share

**Tools:** Plausible, Umami, o Posthog

**Estimación:** 3-4 horas

---

## 📱 MOBILE IMPROVEMENTS

### MOB-001: PWA (Progressive Web App)
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Convertir a PWA instalable
- Service worker
- App manifest

**Beneficios:**
- Offline support
- Instalable en home screen
- Feel nativo

**Estimación:** 6-8 horas

---

### MOB-002: Touch improvements
**Priority:** 🟠 Alta  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Áreas muy pequeñas para tocar en móvil
- Aumentar touch targets mínimo 44x44px

**Estimación:** 2-3 horas

---

## 🎨 UI/UX POLISH

### UI-001: Skeleton loaders
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Loading states muestran solo texto
- Sería mejor skeleton screens

**Ubicaciones:**
- Home (templates loading)
- Gallery (creations loading)

**Estimación:** 2-3 horas

---

### UI-002: Transiciones entre páginas
**Priority:** 🟢 Baja  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Navegación es abrupta
- Agregar page transitions

**Tools:** Framer Motion

**Estimación:** 3-4 horas

---

### UI-003: Empty states mejorados
**Priority:** 🟢 Baja  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Empty states funcionales pero básicos
- Agregar ilustraciones
- Mejor copy

**Estimación:** 2-3 horas

---

## 🚀 DEPLOYMENT & DEVOPS

### DEVOPS-001: CI/CD pipeline
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Actualmente deploy manual con Vercel CLI
- Automatizar con GitHub Actions

**Pasos:**
1. Push to main → auto deploy
2. Run tests antes de deploy
3. Lint check

**Estimación:** 3-4 horas

---

### DEVOPS-002: Environment variables management
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- .env.local en repo (riesgo)
- Documentar variables necesarias
- Usar Vercel env vars

**Estimación:** 1-2 horas

---

### DEVOPS-003: Monitoring y alertas
**Priority:** 🟡 Media  
**Status:** 🚫 Pendiente  
**Descripción:**  
- No hay monitoring de errores en producción
- Implementar Sentry o similar

**Estimación:** 2-3 horas

---

## 📚 DOCUMENTATION

### DOC-001: README completo
**Priority:** 🟡 Media  
**Status:** ⚠️ Parcial  
**Descripción:**  
- README actual es muy básico
- Agregar:
  - Setup instructions
  - Architecture diagram
  - API documentation
  - Contributing guidelines

**Estimación:** 3-4 horas

---

### DOC-002: User guide
**Priority:** 🟢 Baja  
**Status:** 🚫 Pendiente  
**Descripción:**  
- Guía de usuario
- FAQ
- Troubleshooting

**Estimación:** 2-3 horas

---

## 🎯 PRIORIZACIÓN RECOMENDADA

### Sprint 1 (Esta Semana)
1. 🔴 **BUG-001**: Gallery save (Crítico)
2. 🔴 **BUG-002**: Botón Sorpréndeme (Alta)
3. 🟠 **UX-001**: Indicador auto-guardado (Alta)
4. 🟠 **UX-005**: localStorage manejo (Alta)
5. 🔴 **SEC-001**: RLS audit (Crítica)

**Estimación total:** 12-16 horas

### Sprint 2 (Próxima Semana)
1. 🟠 **UX-002**: Filtros funcionando (Alta)
2. 🟠 **TECH-003**: Error handling (Alta)
3. 🟠 **SEC-002**: Input sanitization (Alta)
4. 🟡 **FEAT-006**: Categorías (Media)
5. 🟡 **FEAT-007**: Búsqueda (Media)

**Estimación total:** 14-18 horas

### Sprint 3 (Futuro)
1. 🟠 **BUG-003**: Settings funcional (Media)
2. 🟡 **FEAT-001**: Zoom móvil (Media)
3. 🟡 **MOB-001**: PWA (Media)
4. 🟡 **METRIC-001**: Analytics (Media)

**Estimación total:** 18-23 horas

---

## 📊 MÉTRICAS DE PROYECTO

**Estado Actual:**
- ✅ Funcionalidades Core: 85%
- ⚠️ Bugs Críticos: 3
- 🔧 Tech Debt Items: 5
- 🎨 UI Polish: 60%
- 🛡️ Security: 70%
- 📱 Mobile UX: 75%
- 📚 Documentation: 40%

**Total de Tareas en Backlog:** 45+
**Horas Estimadas (todas):** 200-280 horas

---

## 🎯 CONCLUSIÓN

El MVP está funcional y desplegado, pero hay margen significativo para mejoras en:

1. **Funcionalidad Core** (guardar en Gallery, filtros)
2. **Seguridad** (RLS, sanitization)
3. **UX** (feedback visual, mobile experience)
4. **Tech Debt** (types, error handling, tests)

**Recomendación:** Priorizar Sprints 1 y 2 para tener una v1.5 sólida antes de features avanzadas.
