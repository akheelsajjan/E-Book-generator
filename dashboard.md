# 📝 PRD: Dashboard UI Revamp – eBook App v2

## ✅ Overview

This PRD outlines the redesign and functional improvement plan for the **Dashboard** of the eBook app. The goal is to enhance usability, visual hierarchy, and responsiveness while preserving core functionality.

## 🎯 Objectives

- Improve dashboard aesthetics (modernize UI).
- Introduce tab-based navigation for better content segregation.
- Enhance clarity and visibility of book states (Draft, Published, In Progress).
- Make interactions intuitive with clean components and consistent styling.

## 📌 Scope

| Feature                               | Included |
| ------------------------------------- | -------- |
| Tab-based dashboard for book states   | ✅       |
| Enhanced summary cards (top KPIs)     | ✅       |
| Responsive book cards with new layout | ✅       |
| Search + filters + sort bar           | ✅       |
| Actions menu on book card             | ✅       |
| Visual polish for empty states        | ✅       |
| Mobile-friendly & scroll-free layout  | ✅       |

## 🧩 Features & Components

### 1. Top Summary Section (Stats Cards)

- Cards: Total Books, Published, In Progress, Completion Rate
- Design: Icons per card, Gradient/shadow, Consistent padding
- Hover effect: slight lift and glow

### 2. Search & Filters

- 🔍 Search input with icon
- 🔽 Dropdown: "All Books", "Published", "Drafts"
- 🔃 Optional: Sort dropdown (Recent, Title, Chapters)

### 3. Tabs for Book Views

- Tabs: `All Books | Published | Drafts | In Progress`
- Active tab styled distinctly
- Load corresponding books dynamically per tab

### 4. Book Cards

- Title, Author, Chapters count, Last updated
- Draft/Published badge
- Buttons: Edit (primary), Preview (secondary)
- 3-dot menu: Rename, Duplicate, Delete
- Hover effect: scale and border glow
- Responsive grid layout

### 5. Empty State

- Illustrated SVG + message per tab
- CTA: `Create New Book`

### 6. Mobile & Layout

- Full-height layout
- TOC and Stats scroll independently
- No overall page scroll
- Optional sticky header

## 🔧 Tech Notes

- **Framework:** React + ShadCN components
- **Responsiveness:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Icons:** Lucide / Heroicons
- **Animations:** Tailwind transitions

## 📷 Visual Mockup Guidance

- Spacing: `p-4`, `gap-4`, `rounded-xl`, `shadow-md`
- Tabs: `border-b`, `cursor-pointer`, `transition-colors`
- Stats Cards: `bg-white/80 rounded-xl px-5 py-4`
- Cards Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`

- Theme toggle (Light/Dark)

Remember to use shazn UI components 
We also need a header left top we shall have compny log (For now Ebook-AI)
Top Right side Profile (which we shall implement in future)