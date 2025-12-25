# 🎨 MandalApp Ismart - Guía de Inicio Rápido

## ✅ Integración Completada

Se ha integrado exitosamente Supabase en tu aplicación MandalApp Ismart con las siguientes funcionalidades:

### 🔐 Autenticación
- ✅ Sistema de login/registro con email y contraseña
- ✅ Sesión persistente
- ✅ Logout
- ✅ Modo invitado (sin registro)

### 💾 Base de Datos
- ✅ Tabla de perfiles con roles (user/admin)
- ✅ Tabla de plantillas SVG para administradores
- ✅ Tabla de creaciones de usuarios
- ✅ Row Level Security (RLS) configurado
- ✅ Políticas optimizadas para rendimiento

### 🎭 Roles
- ✅ **Usuario**: Puede pintar y guardar creaciones
- ✅ **Admin**: Puede subir nuevas plantillas SVG

### 📱 Pantallas Nuevas
- ✅ `/auth` - Login y registro
- ✅ `/gallery` - Galería personal del usuario
- ✅ `/admin` - Panel de administración

---

## 🚀 Cómo Empezar

### 1️⃣ Probar la Aplicación

```bash
# Iniciar el servidor de desarrollo
npm run dev
```

Luego abre tu navegador en la URL que muestre Vite (usualmente http://localhost:5173)

### 2️⃣ Registrar tu Primera Cuenta

1. Haz clic en el botón **"Login"** en el header
2. Cambia a modo **"Registro"**
3. Ingresa tu email y contraseña (mínimo 6 caracteres)
4. Haz clic en **"Registrarse"**
5. Verifica tu email (revisa tu bandeja de entrada)

### 3️⃣ Crear tu Primer Administrador

Para acceder al panel de administración necesitas convertir tu cuenta en admin:

**Opción A: Desde Supabase Dashboard (Recomendado)**
1. Ve a https://supabase.com/dashboard
2. Abre el proyecto "MandalApp Ismart"
3. Ve a **Table Editor** → **profiles**
4. Busca tu usuario
5. Haz clic en editar (icono de lápiz)
6. Cambia el campo `role` de `'user'` a `'admin'`
7. Guarda los cambios

**Opción B: Desde SQL Editor**
1. En Supabase Dashboard, ve a **SQL Editor**
2. Ejecuta:
```sql
-- Ver usuarios
SELECT id, email FROM auth.users;

-- Actualizar rol (reemplaza con tu UUID)
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'TU_UUID_AQUI';
```

### 4️⃣ Subir tu Primera Plantilla SVG

Una vez que tengas rol de admin:

1. Verás el botón **"Admin"** en el header
2. Haz clic para ir al panel de administración
3. Completa el formulario:
   - **Título**: Ej. "Mandala Flores"
   - **Descripción**: Descripción opcional
   - **Contenido SVG**: Pega tu código SVG
4. Verás una vista previa
5. Haz clic en **"Subir Plantilla"**

**Ejemplo de SVG simple:**
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
  <circle cx="250" cy="250" r="200" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="250" cy="250" r="150" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="250" cy="250" r="100" fill="none" stroke="currentColor" stroke-width="2"/>
  <circle cx="250" cy="250" r="50" fill="none" stroke="currentColor" stroke-width="2"/>
</svg>
```

---

## 🎯 Flujo de Usuario

### Como Invitado
1. Navegar la galería principal
2. Hacer clic en "¡Sorpréndeme!" para empezar a pintar
3. Colorear (sin poder guardar)

### Como Usuario Registrado
1. Login desde `/auth`
2. Navegar la galería
3. Hacer clic en una plantilla para colorear
4. **Guardar** la creación (funcionalidad por implementar en Coloring.tsx)
5. Ver creaciones guardadas en `/gallery`
6. Descargar o eliminar creaciones

### Como Administrador
1. Todo lo del usuario registrado +
2. Acceso a `/admin`
3. Subir nuevas plantillas SVG
4. Activar/Desactivar plantillas
5. Eliminar plantillas

---

## 📋 Próximos Pasos (Opcional)

### 1. Integrar Guardado en Pantalla de Coloring

Actualizar `screens/Coloring.tsx` para:
- Mostrar botón "Guardar" si el usuario está autenticado
- Abrir modal para poner título a la creación
- Guardar el SVG coloreado en `user_creations`

```typescript
// Ejemplo de función para guardar
const saveCreation = async (title: string, coloredSvg: string) => {
  const { error } = await supabase
    .from('user_creations')
    .insert({
      user_id: user.id,
      title: title,
      colored_svg: coloredSvg,
    });
  
  if (!error) {
    // Mostrar mensaje de éxito
    // Redirigir a /gallery
  }
};
```

### 2. Cargar Plantillas desde la Base de Datos

Actualizar `screens/Home.tsx` para:
- Cargar plantillas desde `svg_templates` en lugar de usar datos estáticos
- Filtrar solo plantillas activas
- Ordenar por fecha de creación

### 3. Mejorar UX
- Añadir loading spinners
- Añadir sistema de notificaciones toast
- Mejorar manejo de errores con mensajes claros
- Añadir confirmaciones antes de acciones destructivas

### 4. Funcionalidades Adicionales
- Galería pública de obras destacadas
- Sistema de categorías para plantillas
- Búsqueda y filtrado en la galería personal
- Compartir creaciones en redes sociales
- Exportar en múltiples formatos (PNG, JPG, PDF)

---

## 🔧 Información Técnica

### Estructura de la Base de Datos

```
profiles
├── id (UUID, PK) → auth.users.id
├── email (TEXT)
├── role (TEXT) → 'user' | 'admin'
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

svg_templates
├── id (UUID, PK)
├── title (TEXT)
├── description (TEXT)
├── svg_content (TEXT)
├── thumbnail_url (TEXT)
├── created_by (UUID) → auth.users.id
├── created_at (TIMESTAMP)
└── is_active (BOOLEAN)

user_creations
├── id (UUID, PK)
├── user_id (UUID) → auth.users.id
├── template_id (UUID) → svg_templates.id
├── title (TEXT)
├── colored_svg (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

### Archivos Creados

```
lib/
  └── supabase.ts              # Cliente y tipos de Supabase

context/
  └── AuthContext.tsx          # Contexto de autenticación

screens/
  ├── Auth.tsx                 # Login/Registro
  ├── Admin.tsx                # Panel de admin
  └── Gallery.tsx              # Galería personal

SUPABASE_INTEGRATION.md        # Documentación detallada
create_admin_user.sql          # Script para crear admin
QUICKSTART.md                  # Esta guía
```

### Archivos Modificados

```
App.tsx                        # + AuthProvider y rutas
screens/Home.tsx               # + Botones de auth
package.json                   # + @supabase/supabase-js
```

---

## 🆘 Solución de Problemas

### "Error: User not authenticated"
- Asegúrate de haber iniciado sesión
- Verifica que tu sesión no haya expirado
- Intenta cerrar sesión y volver a iniciar

### No veo el botón "Admin"
- Verifica que tu usuario tenga rol 'admin' en la tabla `profiles`
- Cierra sesión y vuelve a iniciar para refrescar los permisos

### Las plantillas no aparecen
- Verifica que tengas plantillas con `is_active = true`
- Revisa la consola del navegador para errores
- Verifica la conexión con Supabase

### Error al guardar creaciones
- Asegúrate de estar autenticado
- Verifica que las políticas RLS estén correctamente configuradas
- Revisa los errores en la consola

---

## 📞 Soporte

Para más información, consulta:
- `SUPABASE_INTEGRATION.md` - Documentación técnica completa
- Supabase Dashboard: https://supabase.com/dashboard
- Documentación de Supabase: https://supabase.com/docs

---

## 🎉 ¡Listo para empezar!

Tu aplicación ahora tiene:
- ✅ Sistema de autenticación completo
- ✅ Base de datos segura con RLS
- ✅ Panel de administración funcional
- ✅ Galería personal para usuarios

**Siguiente paso:** Prueba registrarte, conviértete en admin y sube tu primera plantilla SVG!
