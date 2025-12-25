# MandalApp Ismart - Integración Supabase

## 🎨 Descripción

Aplicación de terapia de arte con sistema de autenticación y base de datos integrado con Supabase.

## 📋 Características

### ✅ Implementado

1. **Sistema de Autenticación**
   - Login con email/password
   - Registro de nuevos usuarios
   - Sesión persistente
   - Logout

2. **Base de Datos**
   - **Perfiles de usuario** (`profiles`)
     - Rol de usuario (user/admin)
     - Email
     - Fechas de creación/actualización
   
   - **Plantillas SVG** (`svg_templates`)
     - Título y descripción
     - Contenido SVG
     - Estado activo/inactivo
     - Creador (admin)
   
   - **Creaciones de usuarios** (`user_creations`)
     - SVG coloreado
     - Título personalizado
     - Relación con plantilla original
     - Usuario propietario

3. **Seguridad - Row Level Security (RLS)**
   - Los usuarios solo pueden ver/editar sus propias creaciones
   - Solo los usuarios autenticados ven plantillas activas
   - Solo los administradores pueden subir/editar/eliminar plantillas SVG

4. **Roles de Usuario**
   - **Usuario estándar**: Puede pintar y guardar sus creaciones
   - **Administrador**: Puede subir nuevas plantillas SVG

## 🚀 Rutas de la Aplicación

- `/` - Página principal (galería de plantillas)
- `/auth` - Login/Registro
- `/coloring` - Pantalla de colorear
- `/completion` - Pantalla de finalización
- `/settings` - Ajustes
- `/gallery` - Galería personal del usuario (requiere login)
- `/admin` - Panel de administración (requiere rol admin)

## 🔐 Gestión de Usuarios

### Usuario Invitado
- Puede navegar la galería
- Puede colorear sin guardar
- Debe iniciar sesión para guardar creaciones

### Usuario Registrado
- Acceso a `/gallery` para ver sus creaciones
- Puede guardar creaciones ilimitadas
- Puede descargar sus obras en formato SVG
- Puede eliminar sus creaciones

### Usuario Administrador
- Acceso a `/admin`
- Puede subir nuevas plantillas SVG
- Puede activar/desactivar plantillas
- Puede eliminar plantillas

## 📊 Estructura de Base de Datos

### Tabla: `profiles`
```sql
- id (UUID, PK) → Referencia a auth.users
- email (TEXT, UNIQUE)
- role (TEXT) → 'user' | 'admin'
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Tabla: `svg_templates`
```sql
- id (UUID, PK)
- title (TEXT)
- description (TEXT, nullable)
- svg_content (TEXT)
- thumbnail_url (TEXT, nullable)
- created_by (UUID, FK → auth.users)
- created_at (TIMESTAMP)
- is_active (BOOLEAN)
```

### Tabla: `user_creations`
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- template_id (UUID, FK → svg_templates, nullable)
- title (TEXT, nullable)
- colored_svg (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🛠️ Configuración

### Variables de Entorno
El proyecto usa las siguientes credenciales de Supabase (ya configuradas en `lib/supabase.ts`):
- **Project ID**: `xfomkgtsecfnzjsbpipc`
- **URL**: `https://xfomkgtsecfnzjsbpipc.supabase.co`
- **Anon Key**: Configurada en el código

### Instalación
```bash
npm install
```

### Desarrollo
```bash
npm run dev
```

### Build
```bash
npm run build
```

## 🔧 Cambios Principales

### Archivos Creados
1. `lib/supabase.ts` - Cliente de Supabase y tipos TypeScript
2. `context/AuthContext.tsx` - Contexto de autenticación
3. `screens/Auth.tsx` - Pantalla de login/registro
4. `screens/Admin.tsx` - Panel de administración
5. `screens/Gallery.tsx` - Galería personal del usuario

### Archivos Modificados
1. `App.tsx` - Añadido AuthProvider y nuevas rutas
2. `screens/Home.tsx` - Añadidos botones de login/gallery/admin
3. `package.json` - Añadida dependencia @supabase/supabase-js

## 📝 Próximos Pasos Sugeridos

1. **Integrar con pantalla de Coloring**
   - Añadir botón "Guardar" que persista el SVG coloreado
   - Permitir elegir título al guardar
   - Cargar plantillas desde la base de datos

2. **Mejorar UX**
   - Añadir loading states
   - Mejorar manejo de errores
   - Añadir notificaciones toast

3. **Expandir funcionalidades**
   - Permitir editar creaciones guardadas
   - Compartir creaciones públicamente
   - Sistema de likes/favoritos
   - Galería pública de obras destacadas

4. **Crear primer usuario admin**
   - Registrar un usuario
   - En Supabase Dashboard → Table Editor → profiles
   - Cambiar el campo `role` de 'user' a 'admin'

## 👤 Crear Primer Administrador

Para crear tu primer administrador:

1. Ve a `/auth` y registra una cuenta
2. Abre Supabase Dashboard: https://supabase.com/dashboard
3. Selecciona el proyecto "MandalApp Ismart"
4. Ve a Table Editor → profiles
5. Encuentra tu usuario y edita la fila
6. Cambia `role` de `user` a `admin`
7. Guarda los cambios
8. Recarga la aplicación y verás el botón "Admin" en el header

## 📱 Funcionalidades de cada Pantalla

### /auth
- Formulario de login/registro
- Switch entre modos
- Validación de email
- Opción de continuar como invitado

### /admin (Solo Admin)
- Formulario para subir SVG
- Vista previa del SVG antes de subir
- Lista de todas las plantillas
- Toggle activo/inactivo
- Eliminar plantillas
- Vista previa de cada plantilla

### /gallery (Solo usuarios autenticados)
- Grid de todas las creaciones del usuario
- Vista previa de cada creación
- Botón de descarga (SVG)
- Botón de eliminación
- Estado vacío cuando no hay creaciones

## 🎨 Diseño Visual

Todas las nuevas pantallas siguen el mismo sistema de diseño:
- Gradientes vibrantes
- Animaciones suaves
- Diseño responsivo
- Modo oscuro compatible
- Tipografía consistente

## ⚠️ Notas Importantes

- Las credenciales de Supabase están hardcodeadas. En producción deberían estar en variables de entorno.
- Por defecto, todos los usuarios registrados tienen rol 'user'
- El primer admin debe crearse manualmente en el dashboard de Supabase
- Las políticas RLS protegen los datos incluso si alguien accede directamente a la API
