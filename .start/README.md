# 🚀 Start - Session Documentation

Esta carpeta contiene toda la documentación necesaria para iniciar nuevas sesiones de desarrollo en el proyecto MandalApp.

---

## 📁 Archivos de Inicialización

### **1. PROJECT_HANDOFF.md** ⭐ LEER PRIMERO
**Propósito:** Punto de entrada para nuevas sesiones  
**Contiene:**
- Overview del proyecto
- Tech stack completo
- Database schema
- User flows principales
- Comandos críticos
- Known issues
- Security considerations

**Cuándo leer:** Al inicio de CADA nueva sesión de trabajo

---

### **2. _SESSION_CURRENT.md**
**Propósito:** Estado actual del proyecto  
**Contiene:**
- Última sesión de trabajo
- Cambios recientes
- Features completadas
- Bugs resueltos
- Decisiones técnicas tomadas
- Próximos pasos

**Cuándo leer:** Después de PROJECT_HANDOFF.md

---

### **3. BACKLOG.md**
**Propósito:** Features pendientes priorizadas  
**Contiene:**
- High priority tasks
- Medium priority tasks
- Low priority tasks
- Technical debt
- Features completadas (histórico)

**Cuándo leer:** Para planificar trabajo o buscar siguiente tarea

---

### **4. REDESIGN_PLAN.md**
**Propósito:** Plan de rediseño visual completo  
**Contiene:**
- Inspiración (Instagram/Pinterest)
- Paleta de colores
- Layout structure
- Component updates
- Implementation order
- Visual examples

**Cuándo leer:** Al trabajar en diseño/UI

---

## 🔄 Workflow de Inicio de Sesión

```
1. Leer PROJECT_HANDOFF.md (5 min)
   ↓
2. Leer _SESSION_CURRENT.md (3 min)
   ↓
3. Revisar BACKLOG.md (2 min)
   ↓
4. ¡Empezar a trabajar! 🚀
```

**Tiempo total de onboarding:** ~10 minutos

---

## 📝 Cómo Actualizar al Terminar Sesión

### **Paso 1: Actualizar _SESSION_CURRENT.md**
```markdown
**Session Date:** [FECHA]
**Session Focus:** [TEMA PRINCIPAL]
**Status:** [In Progress/Completed]

## Objectives
- [x] Goal 1
- [ ] Goal 2

## Changes
- File X modified
- Feature Y added

## Next Steps
- Priority task
```

### **Paso 2: Opcional - Archivar Sesión**
Si la sesión fue significativa:
```
1. Copiar _SESSION_CURRENT.md
2. Renombrar: _SESSION_2025-12-24.md
3. Crear nuevo _SESSION_CURRENT.md
```

### **Paso 3: Actualizar BACKLOG.md**
- Mover tasks completadas a "Completed"
- Agregar nuevas tasks si surgieron
- Re-priorizar si es necesario

---

## 🎯 Quick Reference

### **Para empezar rápido:**
```bash
# 1. Leer contexto
cat .start/PROJECT_HANDOFF.md
cat .start/_SESSION_CURRENT.md

# 2. Ver qué falta
cat .start/BACKLOG.md

# 3. Build & Test
npm run build
npm run dev
```

### **Para desplegar:**
```bash
npm run build
vercel --prod --yes
```

### **Para check de base de datos:**
```tsx
mcp_supabase-mcp-server_get_logs({
  project_id: "xfomkgtsecfnzjsbpipc",
  service: "api"
})
```

---

## 🔑 Info Crítica Rápida

**Proyecto:** MandalApp Ismart  
**URL:** https://mandalapp-ismart.vercel.app  
**Supabase:** xfomkgtsecfnzjsbpipc  
**Tech:** React + TypeScript + Vite + Supabase

**Current Sprint:** Modern Redesign  
**Priority:** Visual overhaul (Instagram/Pinterest style)

---

## 📚 Estructura de Archivos de Docs

```
.start/
├── README.md               (este archivo)
├── PROJECT_HANDOFF.md      (↔️ contexto general)
├── _SESSION_CURRENT.md     (📍 estado actual)
├── BACKLOG.md             (📋 tareas pendientes)
└── REDESIGN_PLAN.md       (🎨 plan de diseño)
```

---

## 💡 Tips

### **Para sesiones cortas (<1 hora):**
- Leer solo _SESSION_CURRENT.md
- Elegir 1 task del BACKLOG
- Hacer, desplegar, documentar

### **Para sesiones largas (>2 horas):**
- Leer PROJECT_HANDOFF.md completo
- Revisar BACKLOG completo
- Planificar sprint mini
- Documentar todo al final

### **Para nuevos desarrolladores:**
- Leer TODO en orden
- Hacer git clone
- Setup env variables
- Test localmente primero

---

## 🚨 Recordatorios Importantes

1. **Siempre leer PROJECT_HANDOFF.md al inicio**
2. **Actualizar _SESSION_CURRENT.md al final**
3. **Documentar decisiones importantes**
4. **Desplegar después de features mayores**
5. **Archivar sesiones significativas**

---

**Última actualización:** 2025-12-24  
**Mantenido por:** Equipo MandalApp
