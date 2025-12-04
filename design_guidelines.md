# Design Guidelines: Student Roster Management Application

## Design Approach

**Selected Approach**: Design System - Modern Data Management UI
**Rationale**: This is a utility-focused, information-dense application requiring efficient data management, CRUD operations, and productivity workflows. The design will prioritize clarity, usability, and data accessibility over visual flair.

**Design Philosophy**: Clean, functional interface inspired by modern productivity tools (Linear, Notion, Airtable) with emphasis on data readability and efficient workflows.

---

## Core Design Elements

### A. Typography

**Font Family**:
- Primary: Inter or Noto Sans Thai (Google Fonts) - excellent Thai language support with clean, modern appearance
- Fallback: system-ui, -apple-system

**Hierarchy**:
- Page Title: text-3xl font-bold (student count, dashboard title)
- Section Headers: text-xl font-semibold (statistics sections, table headers)
- Card/Modal Titles: text-lg font-semibold
- Body Text: text-base font-normal (student names, data cells)
- Labels/Meta: text-sm font-medium (column headers, filter labels, badges)
- Captions: text-xs (timestamps, helper text)

### B. Layout System

**Spacing Units**: Use Tailwind spacing scale focused on: 2, 3, 4, 6, 8, 12, 16, 24
- Component padding: p-4 to p-6
- Section gaps: gap-6 to gap-8
- Card spacing: p-6
- Form element spacing: gap-4
- Page margins: px-4 md:px-8 lg:px-12

**Container Strategy**:
- Main container: max-w-7xl mx-auto
- Modal/Form containers: max-w-2xl
- Card grid: max-w-7xl with responsive columns

**Responsive Grid**:
- Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Statistics: grid-cols-2 md:grid-cols-4
- Mobile-first with stacking priority

---

## C. Component Library

### Navigation & Header
**Top Navigation Bar**:
- Fixed/sticky header with app title and student count badge
- Right-aligned controls: theme toggle, export button, add student button
- Height: h-16, with shadow-sm for separation
- Layout: flex justify-between items-center with px-6

### Data Display Components

**Table View** (Primary Display):
- Clean bordered table with alternating row styling
- Sticky header row for scrolling
- Column structure: Name (40%), Student ID (15%), Phone (20%), Birthday (20%), Actions (5%)
- Row height: h-14 for comfortable touch targets
- Sortable column headers with sort indicators
- Mobile: Convert to stacked cards below md breakpoint

**Card View** (Alternative Display):
- Grid layout: gap-4 with responsive columns
- Card structure: rounded-lg border with p-6
- Card sections: Student icon/avatar area, name (text-lg font-semibold), metadata grid (2 columns for ID/Phone/Birthday)
- Birthday badge positioned top-right if upcoming
- Action buttons bottom-aligned

**Statistics Dashboard**:
- 4-column grid on desktop (2 on tablet, 1 on mobile)
- Stat card: rounded-lg border p-6
- Structure: Large number (text-3xl font-bold), label (text-sm), optional icon
- Use min-h-24 for consistent card heights

### Interactive Controls

**Search Bar**:
- Prominent placement at top of data section
- Full-width on mobile, max-w-md on desktop
- Height: h-12 with rounded-lg border
- Include search icon (left) and clear button (right when active)
- Placeholder: "ค้นหาชื่อหรือรหัสนักเรียน..."

**Filter Controls**:
- Month filter: Dropdown/select component (h-10)
- View toggle: Segmented control (Table/Card) with visual active state
- Sort controls: Dropdown with clear labels in Thai
- Group filters in single row with gap-3

**Form Elements** (Add/Edit Modal):
- Input fields: h-12 with rounded-md border
- Label spacing: gap-2 (label above input)
- Form spacing: gap-6 between field groups
- Required field indicators: red asterisk
- Validation messages: text-sm below inputs

**Buttons**:
- Primary (Add Student, Save): h-10 px-6 rounded-md font-medium
- Secondary (Cancel, Export): h-10 px-6 rounded-md with border
- Icon buttons (Edit, Delete): h-9 w-9 rounded-md
- Floating action button (mobile add): h-14 w-14 rounded-full, fixed bottom-6 right-6

### Overlays & Modals

**Modal Structure**:
- Backdrop: Semi-transparent overlay
- Dialog: max-w-2xl rounded-lg with p-6
- Header: text-xl font-semibold with close button (h-12)
- Content area: max-h-[70vh] overflow-y-auto
- Footer: Flex with gap-3, right-aligned buttons

**Notification Badges**:
- Birthday notifications: Small badge (h-6 px-2 text-xs) with rounded-full
- Positioned top-right on cards or inline in table
- Include count when multiple upcoming birthdays

**Export Menu**:
- Dropdown/popover from export button
- List items with icons (CSV, PDF, Excel)
- Each option: h-10 px-4 with hover state

### Empty States & Feedback

**No Results State**:
- Centered content with icon, text-lg message, text-sm helper text
- Minimum height: min-h-64 for proper centering

**Loading States**:
- Skeleton screens for table rows (h-14 with shimmer)
- Spinner for button actions (h-5 w-5)

**Success/Error Messages**:
- Toast notifications: rounded-lg with p-4, positioned top-right
- Auto-dismiss after 3 seconds

---

## D. Animations

**Minimal, Purposeful Motion**:
- Modal enter/exit: Fade + scale (duration-200)
- Dropdown menus: Slide-in (duration-150)
- Hover states: Simple opacity/border changes (no transitions needed)
- Theme toggle: Smooth fade between themes (duration-300)
- **No scroll animations, no page transitions, no decorative motion**

---

## Layout Specifications

### Page Structure
1. **Header Section** (sticky): App title, controls, theme toggle
2. **Statistics Bar**: 4 stat cards in horizontal grid
3. **Controls Row**: Search + Filters + View toggle, all inline
4. **Birthday Notifications** (conditional): Alert banner if upcoming birthdays exist
5. **Main Content**: Table or Card grid based on selected view
6. **Footer**: Minimal with student count summary

### Responsive Behavior
- Desktop (lg+): Full table with all columns, 4-column stats, horizontal controls
- Tablet (md): 2-column stats, simplified table or 2-column cards
- Mobile (base): Stacked stats, cards only (no table), stacked controls, floating add button

---

## Accessibility & Thai Language

- All labels, placeholders, buttons in Thai
- Proper font rendering for Thai characters (Noto Sans Thai)
- Clear focus states on all interactive elements (ring-2 ring-offset-2)
- ARIA labels for icon-only buttons
- Keyboard navigation support for modals and dropdowns
- Consistent tab order through forms and tables

---

## Images

**No hero image needed** - This is a data-focused utility application.

**Optional Icons/Illustrations**:
- Empty state illustration: Simple student/classroom themed graphic when no data exists
- Student placeholder avatars: Generic user icon or initials-based avatars in cards
- Feature icons: Use Heroicons for all UI icons (search, filter, export, edit, delete, calendar)