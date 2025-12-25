# MandalApp - Product Backlog

**Last Updated:** 2025-12-24  
**Project:** MandalApp Ismart  
**Version:** 2.0

---

## 🎯 Current Sprint

**Sprint 2.0** - ✅ COMPLETED  
**Focus:** Navigation, Filters & Public Gallery

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
- Track remix chain (A → B → C)

**Technical Notes:**
- Need to load PNG dataURL into canvas
- Create new creation with reference
- Consider permission model

---

### UX-006: Login Modal for Likes
**Description:** Better UX when non-logged user tries to like  
**Priority:** HIGH  
**Estimated Effort:** 2 hours  
**Status:** 🆕 NOT STARTED

**Current:** `alert('Debes iniciar sesión')`  
**Proposed:** Modal with "Iniciar Sesión" / "Registrarse" buttons

---

### UI-002: Empty States
**Description:** Better messaging when galleries are empty  
**Priority:** MEDIUM-HIGH  
**Estimated Effort:** 1 hour  
**Status:** 🆕 NOT STARTED

**Locations:**
- Public gallery (no published works yet)
- Personal gallery (no creations yet)
- Search with no results (already done ✅)

---

## 🟡 Medium Priority

### MOB-001: PWA Support
**Description:** Make app installable on mobile/desktop  
**Priority:** MEDIUM  
**Estimated Effort:** 6-8 hours  
**Status:** 📋 PLANNED

**Requirements:**
- manifest.json
- Service worker
- Offline support (optional)
- Install prompt

---

### FEAT-001: Mobile Zoom Gestures
**Description:** Pinch-to-zoom on canvas for mobile  
**Priority:** MEDIUM  
**Estimated Effort:** 3-4 hours  
**Status:** 📋 PLANNED

**Technical:** Touch events, gesture recognition

---

### UI-001: Skeleton Loaders
**Description:** Loading skeletons instead of spinners  
**Priority:** MEDIUM  
**Estimated Effort:** 2-3 hours  
**Status:** 📋 PLANNED

**Locations:**
- Template cards grid
- Public gallery grid
- Personal gallery grid

---

### FEAT-009: Version Management
**Description:** UI to manage multiple versions of same work  
**Priority:** MEDIUM  
**Estimated Effort:** 4 hours  
**Status:** 🆕 NOT STARTED

**Features:**
- Group versions in gallery
- "Create new version" explicit button
- Version counter display
- Delete specific versions

---

### FEAT-010: Template Browse Filters in Public Gallery
**Description:** Filter public works by category/difficulty  
**Priority:** MEDIUM  
**Estimated Effort:** 2 hours  
**Status:** 🆕 NOT STARTED

---

## 🟢 Low Priority

### FEAT-011: Download All Works
**Description:** Bulk download of all personal creations  
**Priority:** LOW  
**Estimated Effort:** 3 hours  
**Status:** 💡 IDEA

---

### FEAT-012: Color Palette History
**Description:** Remember last N colors used  
**Priority:** LOW  
**Estimated Effort:** 2 hours  
**Status:** 💡 IDEA

---

### FEAT-013: Trending Works
**Description:** Show "most liked this week" in public gallery  
**Priority:** LOW  
**Estimated Effort:** 3 hours  
**Status:** 💡 IDEA

**Technical:** Need timestamp on likes, aggregate query

---

### FEAT-014: Comments System
**Description:** Allow comments on public works  
**Priority:** LOW  
**Estimated Effort:** 10+ hours  
**Status:** 💡 IDEA

**Requires:**
- New table: `artwork_comments`
- Moderation system
- Notifications (optional)

---

### FEAT-015: User Profiles
**Description:** Public user profile pages  
**Priority:** LOW  
**Estimated Effort:** 8+ hours  
**Status:** 💡 IDEA

**Features:**
- Profile page `/user/{id}`
- Show all public works
- Bio, avatar
- Follow system (optional)

---

## 🔧 Technical Debt

### TECH-003: Global Error Handling
**Description:** Centralized error boundary and logging  
**Priority:** MEDIUM  
**Estimated Effort:** 4-5 hours  
**Status:** 📋 PLANNED

---

### TECH-004: Code Splitting
**Description:** Dynamic imports to reduce bundle size  
**Priority:** LOW  
**Estimated Effort:** 3 hours  
**Status:** 💡 IDEA

**Current:** 520KB bundle (warning)  
**Target:** <300KB main chunk

---

### TECH-005: TypeScript Strict Mode
**Description:** Enable strict TypeScript checking  
**Priority:** LOW  
**Estimated Effort:** 6 hours  
**Status:** 💡 IDEA

---

## ✅ Completed (Sprint 2.0)

### Sprint 2.0: Navigation & Social
- [x] FEAT-007: Search by text
- [x] UX-002: Difficulty filters
- [x] FEAT-006: Category tabs
- [x] FEAT-004: Public gallery
- [x] FEAT-005: Like system
- [x] UX-003: Multiple versions support
- [x] FEAT-016: "Colorear este diseño" button

### Sprint 1.5: UX & Security
- [x] UX-001: Auto-save indicator
- [x] UX-005: localStorage quota handling
- [x] SEC-002: SVG sanitization
- [x] FEAT-003: Edit button
- [x] FEAT-017: Share button
- [x] FEAT-018: Publish system

### Sprint 1.0: Core Features
- [x] FEAT-002: Pan/Drag for zoom
- [x] BUG-001: Gallery save functionality
- [x] BUG-002: "Sorpréndeme" button
- [x] BUG-004: Terminology standardization

---

## 📊 Priority Matrix

### Must Have (Next Sprint):
1. Remix system
2. Empty states
3. Login modal for likes

### Should Have (Sprint after):
1. PWA support
2. Mobile gestures
3. Skeleton loaders

### Nice to Have:
1. Version management UI
2. Trending works
3. Comments

### Future:
1. User profiles
2. Follow system
3. Notifications

---

## 🎯 Suggested Sprint 3.0

**Name:** Social Features  
**Duration:** 8-12 hours  
**Focus:** Remix system + UX polish

### Sprint Goals:
1. Implement Remix system (5-6h)
2. Add login modal for likes (2h)
3. Add empty states (1h)
4. Add skeleton loaders (2-3h)

**Total:** ~10-12 hours

---

## 📝 Notes

### Version Management Philosophy:
- **Current:** User creates versions manually by saving
- **Proposed:** Make it more explicit with "New Version" button
- **Consider:** Auto-increment version numbers

### Remix Chain Tracking:
```
Original Work A
  ├─ Remix B (by user2)
  │   └─ Remix C (by user3)
  └─ Remix D (by user4)
```

Should we show the full chain or just immediate parent?

### Public Gallery Filters:
Similar to home page but for community works:
- By category
- By difficulty (of template)
- By date
- By popularity (likes)

---

**Backlog Status:** Up to date ✅  
**Next Review:** Start of Sprint 3.0
