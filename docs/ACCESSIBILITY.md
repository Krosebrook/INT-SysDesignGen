# Accessibility (a11y) Statement

Staff Engineer Architect targets **WCAG 2.1 AA** compliance.

## Core Features

### 1. Color Contrast
All text elements maintain a contrast ratio of at least 4.5:1 against their background.
- **Primary Text**: `gray-200` on `gray-900`.
- **Interactive Elements**: `blue-500` for primary actions.

### 2. Keyboard Navigation
- **Focus States**: All inputs and buttons have visible focus rings (`focus:ring-2`).
- **Tab Order**: Logical flow from Navigation -> Main Content -> Action Buttons.

### 3. Screen Readers
- **ARIA Labels**: Used on icon-only buttons (e.g., "Close Menu", "Settings").
- **Semantic HTML**: Proper use of `<header>`, `<main>`, `<nav>`, and `<button>`.

### 4. Motion
- **Reduced Motion**: Animations use `animate-in` which can be disabled via CSS media queries if needed.
- **Flashing**: No content flashes more than 3 times per second.
