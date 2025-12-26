# MandalApp - Project Handoff

## 🚀 Quick Start (New Session Initialization)

### 1. Context Loading
Read in this order:
1. `PROJECT_HANDOFF.md` (this file)
2. `_SESSION_CURRENT.md` (latest session state - VERY IMPORTANT)
3. `BACKLOG.md` (for pending tasks)

### 2. Essential Information

**Project Name:** MandalApp Ismart  
**Tech Stack:** React + TypeScript + Vite + Supabase + Vercel  
**Deployed URL:** https://mandalapp-ismart.vercel.app  
**Supabase Project ID:** xfomkgtsecfnzjsbpipc  
**Branding:** "GUDIÑO Y TÚ" - Arte colaborativo  

---

## 📁 Project Structure

```
MandalApp-Ismart/
├── components/          # Reusable components
│   ├── Logo.tsx         # Dynamic SVG Logo (Black/White + Responsive)
│   ├── ArtCard.tsx      # Clean minimal card
│   └── HeartIcon.tsx    # Custom heart icon
├── screens/            # Main application screens
│   ├── Home.tsx        # Main entry + Community Gallery
│   ├── Coloring.tsx    # Drawing/Painting engine
│   ├── Gallery.tsx     # User creations
│   ├── Admin.tsx       # Template management
│   └── Auth.tsx        # Login/Register
├── context/
│   ├── ThemeContext.tsx # Dark/Light mode management
│   └── AuthContext.tsx  # Supabase auth wrapper
├── src/styles/
│   └── minimal.css     # Unified Design System
└── index.html          # Global overrides and entry
```

---

## 🗄️ Database Schema (Supabase)

### Tables:
- **`svg_templates`**: Master designs for users to color.
- **`user_creations`**: Saved works. Boolean `is_public` makes them show in Home.
- **`artwork_likes`**: Tracks unique likes per user/work.

---

## 🔑 Key Design Decisions

### 1. **Minimal Design System**
We moved away from heavy Tailwind gradients. Everything now uses the **`minimal-grid`** system (Instagram/Pinterest style) with CSS variables:
- White backgrounds, subtle shadows, `.instagram-grid` (3 columns), `.masonry-grid`.

### 2. **Mobile-First Header**
The header is now standardize and highly responsive:
- Logo scales from 120px to 60px.
- Hamburger menu is visible for ALL users (logged or guests).
- Theme toggle is always accessible.

### 3. **Branding Sync**
The Logo component dynamically switches between `logo_black.svg` and `logo_white.svg` based on the `ThemeContext` state, NOT system preferences.

---

## 🎨 Current Version Status

**Phase 1-3:** ✅ COMPLETED (Home, Gallery, Mobile/Polish)  
**Current Sprint:** 3.0 - Social Features & UX Polish  
**Branding Status:** ✅ "GUDIÑO Y TÚ" implemented.

---

## 🐛 Known Issues & Safe Workarounds

- **Horizontal Overflow:** Fixed via `overflow-x: hidden` in body and responsive flex-wrap in header.
- **Theme Lag:** Logo might take a few ms to switch while asset loads.

---

## 📋 High Priority Backlog

- [ ] **Remix System:** Allow users to use a community work as a base.
- [ ] **Admin UI:** Polish the template upload form to match the minimal aesthetic.
- [ ] **Login Modals:** Replace browser `alert()` with custom accessible modals.

---

**Last Updated:** 2025-12-26  
**Version:** 3.0 (Modern Redesign & Mobile Fixes)
