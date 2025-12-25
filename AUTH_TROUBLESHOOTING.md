# 🔒 TROUBLESHOOTING: Auth Session No Persiste

## Problema
Al actualizar la página en `/gallery`, te pide hacer login nuevamente.

## Causa Probable
El localStorage no se está guardando o leyendo correctamente.

---

## ✅ SOLUCIÓN 1: Limpiar LocalStorage Viejo (CRÍTICO)

**Debes hacer esto UNA VEZ:**

### Opción A: Desde DevTools
1. Abre tu sitio: https://mandalapp-ismart.vercel.app/
2. Presiona `F12` (o `Cmd+Option+I` en Mac)
3. Ve a la pestaña **"Application"** (Chrome) o **"Storage"** (Firefox)
4. En el menú lateral izquierdo:
   - Expand **"Local Storage"**
   - Click en `https://mandalapp-ismart.vercel.app`
5. **BORRA TODO:**
   - Click derecho → "Clear" 
   - O selecciona todo y presiona Delete
6. Cierra DevTools
7. **Refresca la página** (`Ctrl+R`)
8. **Haz login nuevamente**

### Opción B: Desde la Consola
1. Presiona `F12`
2. Ve a la pestaña **"Console"**
3. Escribe: `localStorage.clear()`
4. Presiona Enter
5. Refresca y haz login nuevamente

---

## ✅ SOLUCIÓN 2: Verificar que la Sesión se Guardó

**Después de hacer login:**

1. Abre DevTools (`F12`)
2. Ve a **"Application" → "Local Storage"**
3. Busca una llave que diga **`mandalapp-auth`** o **`sb-xfomkgtsecfnzjsbpipc-auth-token`**
4. **Debería tener un valor largo (JSON con el token)**

**Si NO ves esta llave:**
- El fix de auth NO se aplicó correctamente
- Vercel puede no haber deployado la última versión

**Si SÍ ves esta llave:**
- El auth está funcionando ✅
- Ahora al refrescar NO debería pedir login

---

## ✅ SOLUCIÓN 3: Verificar Deployment de Vercel

Ve al dashboard de Vercel y confirma que el último deployment incluye el commit:
- **`ff76598`** - "CRITICAL FIX: Add auth session persistence"

Si NO está incluido:
- Vercel no deployó esa versión
- Necesitas forzar un nuevo deployment

---

## 🔍 DIAGNÓSTICO AVANZADO

Si aún no funciona después de todo esto, ejecuta en la consola:

```javascript
// Ver configuración de Supabase
console.log(supabase.auth);

// Ver sesión actual
supabase.auth.getSession().then(({data}) => console.log('Session:', data));

// Ver localStorage
console.log('LocalStorage:', localStorage);
```

Copia el resultado y dímelo para investigar más.

---

## 📝 NOTAS TÉCNICAS

### Qué hicimos para arreglar esto:

En `lib/supabase.ts`, cambiamos de:
```typescript
export const supabase = createClient(url, key);
```

A:
```typescript
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    storageKey: 'mandalapp-auth',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
```

Esto OBLIGA a Supabase a:
- Guardar la sesión en localStorage
- Renovar el token automáticamente
- Recuperar la sesión al cargar la página

---

## 🎯 CHECKLIST FINAL

- [ ] Limpié completamente el localStorage (Solución 1)
- [ ] Hice login nuevamente
- [ ] Verifiqué que existe la llave `mandalapp-auth` en localStorage
- [ ] Actualicé la página (`F5`)
- [ ] **¿Sigue pidiendo login?**

Si marcaste TODO y aún pide login:
- Toma screenshots de:
  1. DevTools → Application → Local Storage
  2. DevTools → Console (con los comandos de diagnóstico)
- Y dímelo para investigar más

---

**Última actualización:** 2025-12-25 18:15
**Commit con el fix:** `ff76598`
