# MandalApp - Project Handoff

## 🚀 Quick Start (New Session Initialization)

### 1. Context Loading
Read in this order:
1. `PROJECT_HANDOFF.md` (this file)
2. `_SESSION_CURRENT.md` (latest session state)
3. `ARCHITECTURE.md` (if architecture questions)
4. `BACKLOG.md` (for pending tasks)

### 2. Essential Information

**Project Name:** MandalApp Ismart  
**Tech Stack:** React + TypeScript + Vite + Supabase + Vercel  
**Deployed URL:** https://mandalapp-ismart.vercel.app  
**Supabase Project ID:** xfomkgtsecfnzjsbpipc  

---

## 📁 Project Structure

```
MandalApp-Ismart/
├── components/          # Reusable components
│   ├── ArtCard.tsx
│   ├── HeartIcon.tsx   # Custom heart icon (filled/unfilled)
│   └── ...
├── screens/            # Main application screens
│   ├── Home.tsx        # Gallery + Community gallery
│   ├── Coloring.tsx    # Canvas coloring screen
│   ├── Gallery.tsx     # User's personal works
│   ├── Admin.tsx       # Admin template upload
│   └── Auth.tsx        # Authentication
├── context/
│   └── AuthContext.tsx # Supabase auth wrapper
├── lib/
│   └── supabase.ts     # Supabase client + types
└── index.html          # Entry point
```

---

## 🗄️ Database Schema (Supabase)

### Tables:

#### `svg_templates`
- `id` (uuid, PK)
- `title` (text)
- `difficulty` (text) - "Principiante" | "Intermedio" | "Avanzado"
- `category` (text)
- `svg_content` (text) - Sanitized SVG
- `background_color` (text)
- `created_at`, `updated_at`

#### `user_creations`
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `template_id` (uuid, FK → svg_templates) - nullable
- `title` (text)
- `colored_svg` (text) - PNG dataURL
- `is_public` (boolean) - default: false
- `show_author` (boolean) - default: false
- `likes_count` (integer) - default: 0
- `created_at`, `updated_at`

**NO UNIQUE CONSTRAINT** - Multiple versions allowed

#### `artwork_likes`
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `creation_id` (uuid, FK → user_creations)
- `created_at`
- **UNIQUE(user_id, creation_id)**

### RPC Functions:
- `increment_likes(creation_id UUID)`
- `decrement_likes(creation_id UUID)`

---

## 🔑 Key Design Decisions

### 1. **Auto-Save Strategy**
- **localStorage:** Every 500ms (fast, local backup)
- **Supabase:** Only on "Mis Obras" button click
- **Why:** Allows creating multiple versions intentionally

### 2. **Multiple Versions**
- Users CAN have multiple colored versions of same template
- No UNIQUE constraint on (user_id, template_id)
- Each click "Mis Obras" = new creation

### 3. **Public Gallery System**
- Users choose to publish (`is_public = true`)
- Can show name (`show_author = true`) or be anonymous
- Likes only for logged users
- Shows 12 most recent

### 4. **SVG Sanitization**
- Uses DOMPurify in Admin upload
- Prevents XSS attacks
- Config: `USE_PROFILES: { svg: true }`

---

## 🎨 User Flows

### Flow 1: Colorear y Guardar
```
Home → Pick Template → Coloring Screen
  → Paint with flood fill algorithm
  → Auto-save to localStorage (500ms)
  → Click "Mis Obras" (green button)
    → INSERT to user_creations
    → Navigate to Gallery
```

### Flow 2: Publicar Obra
```
Gallery → Click "🌍 Publicar"
  → Modal opens: "Con mi nombre" | "Anónimo"
  → Updates is_public=true, show_author
  → Appears in Home → Community Gallery
```

### Flow 3: Dar Like
```
Home → Scroll to Community Gallery
  → Click artwork → Modal opens
  → Click heart ❤️
    → Toggle like/unlike (optimistic UI)
    → Insert/delete artwork_likes
    → Update likes_count via RPC
```

### Flow 4: Colorear desde Galería Pública
```
Home → Community Gallery → Click artwork
  → Modal with "🎨 Colorear este diseño"
  → Navigate to /coloring?template={template_id}
  → Start fresh with that template
```

---

## ⚙️ Critical Commands

### Build & Deploy
```bash
npm run build
vercel --prod --yes
```

### Database Migrations
```tsx
mcp_supabase-mcp-server_apply_migration({
  name: "migration_name",
  project_id: "xfomkgtsecfnzjsbpipc",
  query: "SQL..."
})
```

### Check Logs
```tsx
mcp_supabase-mcp-server_get_logs({
  project_id: "xfomkgtsecfnzjsbpipc",
  service: "api" | "postgres" | "auth"
})
```

---

## 🐛 Known Issues & Workarounds

### Issue: Gallery not visible
**Cause:** No public works in database yet  
**Fix:** Publish at least one work first

### Issue: Duplicate hearts in UI
**Cause:** useAuth() called twice  
**Fix:** Already fixed - single useAuth() at top level

---

## 📋 Pending Features (See BACKLOG.md)

**High Priority:**
- [ ] Remix system (copy colored work as base)
- [ ] Original work credits
- [ ] UX improvement: Login modal instead of alert

**Medium Priority:**
- [ ] PWA support
- [ ] Mobile zoom gestures
- [ ] Skeleton loaders

---

## 🔐 Security Considerations

1. **SVG Sanitization:** Always use DOMPurify on upload
2. **RLS Policies:** User can only modify own creations
3. **Likes:** Must be authenticated
4. **Admin:** Role-based (check user metadata)

---

## 🎯 Current Sprint Status

**Sprint:** 2.0 - Accessibility & Navigation  
**Status:** ✅ COMPLETED

**Completed Features:**
- [x] Search by text
- [x] Difficulty filters
- [x] Dynamic categories
- [x] Public gallery
- [x] Like system with custom heart icon
- [x] "Colorear este diseño" button

**Next Sprint:** 3.0 - Social Features
- Remix system
- Comments (future)
- User profiles (future)

---

## 📞 Support Contacts

**Supabase Dashboard:** https://supabase.com/dashboard/project/xfomkgtsecfnzjsbpipc  
**Vercel Dashboard:** https://vercel.com/dearbigcs-projects/mandalapp-ismart  
**Production URL:** https://mandalapp-ismart.vercel.app

---

## 📝 Session Workflow

**Before Starting New Session:**
1. Read this file
2. Check `_SESSION_CURRENT.md`
3. Review `BACKLOG.md` if planning features

**During Session:**
- Document major decisions
- Update architecture docs if needed

**End of Session:**
- Update `_SESSION_CURRENT.md`
- Commit changes
- Deploy if ready

---

**Last Updated:** 2025-12-24  
**Version:** 2.0
