# MandalApp - Product Backlog

**Last Updated:** 2025-12-26  
**Project:** MandalApp Ismart  
**Version:** 3.0 (Modern Redesign)

---

## 🎯 Current Sprint: 3.0 - Social Features & Advanced UX

**Phase Status:**
- ✅ Phase 1: Home Page Redesign (Complete)
- ✅ Phase 2: Gallery Page Redesign (Complete)
- ✅ Phase 3: Mobile UI & Header Standardization (Complete)
- 🚀 **Next:** Social Features (Remix) & Form Polish

---

## 🔴 High Priority

### FEAT-008: Remix System
**Description:** Allow users to copy public colored works as starting point  
**Priority:** HIGH  
**Estimated Effort:** 5-6 hours  
**Status:** 🆕 NOT STARTED

**Requirements:**
- Add `original_creation_id UUID` field to user_creations
- Add "Remix" button in artwork detail modal
- Load colored artwork as canvas starting point (not template)
- Show attribution: "Remix de @original_author"

---

### UI-003: Admin Form Redesign
**Description:** Refactor the template upload form to match the "Minimal Card" aesthetic.  
**Priority:** HIGH  
**Status:** 📋 PLANNED

- Replace standard inputs with `.minimal-input`.
- Use `.minimal-card` for the form container.
- Consistent buttons and spacing.

---

### UX-006: Login Modal for Likes
**Description:** Better UX when non-logged user tries to like  
**Priority:** HIGH  
**Status:** 📋 PLANNED

**Current:** `alert('Debes iniciar sesión')`  
**Proposed:** Minimal modal with "Login" and "Register" buttons.

---

## 🟡 Medium Priority

### FEAT-001: Mobile Zoom Gestures
**Description:** Pinch-to-zoom on canvas for mobile  
**Priority:** MEDIUM  
**Status:** 📋 PLANNED

### MOB-001: PWA Support
**Description:** Make app installable  
**Priority:** MEDIUM  
**Status:** 💡 IDEA

---

## ✅ Completed (Recently)

### Sprint 3.0 Fixes & Branding
- [x] **Universal Mobile Menu:** Hamburger menu for all users.
- [x] **Responsive Logo:** Fixed oversized header on mobile.
- [x] **"GUDIÑO Y TÚ" Branding:** Full layout and content update.
- [x] **Theme Toggle Polish:** Added toggle for logged users and in mobile drawer.
- [x] **Gallery Title Contrast:** Fixed dark mode readability for community gallery header.

### Sprint 3.0 Modern Redesign
- [x] **Home Page:** Instagram-style layout, masonry grid.
- [x] **Gallery Page:** Minimal redesign with 3-column grid.
- [x] **Design System:** Creation of `minimal.css` utility classes.

---

**Backlog Status:** Ready for next session 🚀
