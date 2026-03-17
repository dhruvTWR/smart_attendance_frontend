# UI Components Index

## ✅ ACTIVELY USED Components

These components are imported and used throughout the project:

### Layout & Structure
- **button.tsx** - Button component with variants (primary, secondary, outline, ghost, etc.)
- **card.tsx** - Card container with Header, Title, Description, Content, Footer
- **dialog.tsx** - Modal dialog component with customizable content

### Data Display
- **table.tsx** - Table component with Header, Body, Rows, Cells
- **badge.tsx** - Badge/tag component for status indicators
- **progress.tsx** - Progress bar component

### Forms & Input
- **input.tsx** - Text input field component
- **label.tsx** - Form label component  
- **select.tsx** - Dropdown select component
- **calendar.tsx** - Calendar date picker component

### Navigation & Utils
- **popover.tsx** - Popover component for floating content
- **alert.tsx** - Alert/notification component

---

## ⚠️ CURRENTLY UNUSED Components

These components are available but not actively imported in any components. They are commented out for future use:

### Not Currently Used (Can be uncommented on demand)
- accordion.tsx - Collapsible accordion component
- alert-dialog.tsx - Dialog for alerts/confirmations
- aspect-ratio.tsx - Aspect ratio container
- avatar.tsx - Avatar/profile image component
- breadcrumb.tsx - Breadcrumb navigation
- carousel.tsx - Image carousel/slider
- chart.tsx - Chart components (Recharts integration)
- checkbox.tsx - Checkbox input
- collapsible.tsx - Collapsible sections
- command.tsx - Command palette component
- context-menu.tsx - Right-click context menu
- drawer.tsx - Side drawer/panel
- hover-card.tsx - Hover tooltip card
- input-otp.tsx - OTP/PIN input
- menubar.tsx - Menu bar component
- navigation-menu.tsx - Navigation menu
- pagination.tsx - Pagination controls
- radio-group.tsx - Radio button group
- resizable.tsx - Resizable panels
- skeleton.tsx - Loading skeleton
- slider.tsx - Slider/range input
- sonner.tsx - Toast notifications
- switch.tsx - Toggle switch
- tabs.tsx - Tab navigation
- textarea.tsx - Multi-line text input
- toggle.tsx - Toggle button
- toggle-group.tsx - Toggle button group
- tooltip.tsx - Tooltip component
- use-mobile.ts - Mobile detection hook
- utils.ts - Utility functions

---

## 📋 Usage Guide

### Using Active Components:
```jsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// ... etc
```

### To Enable Unused Components:
1. Find the commented file (e.g., `accordion.tsx`)
2. Uncomment the code
3. Import in your component
4. Update this INDEX.md file

---

## 🗂️ File Organization

```
components/
├── ui/
│   ├── USED (Active)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── badge.tsx
│   │   ├── progress.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── calendar.tsx
│   │   ├── popover.tsx
│   │   └── alert.tsx
│   │
│   ├── UNUSED (Commented out - see below)
│   │   ├── accordion.tsx (COMMENTED)
│   │   ├── alert-dialog.tsx (COMMENTED)
│   │   ├── ... (see list above)
│   │
│   ├── utils.ts (Active - utilities)
│   ├── use-mobile.ts (Active - mobile detection)
│   └── INDEX.md (This file)
```

---

## 📝 Notes
- Commented components can be restored by uncommenting the first and last lines
- `utils.ts` and `use-mobile.ts` are kept active as they're used by active components
- Consider removing truly unused components after a full project review
