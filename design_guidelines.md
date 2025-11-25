# Badminton Round Robin Scheduler - Design Guidelines

## Design Approach
**System-Based Approach**: Material Design principles adapted for sports scheduling
**Rationale**: Information-dense, utility-focused application requiring clarity, efficient data presentation, and intuitive interactions for casual users

## Core Layout Structure

**Container System**
- Main container: `max-w-6xl mx-auto px-4`
- Card-based sections with consistent `p-6` internal spacing
- Multi-column layouts for match displays: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Single column for player input and statistics tables

**Page Sections** (vertical flow)
1. Header with title and tagline
2. Player Input Interface (collapsible after generation)
3. Action Controls (generate button, reset)
4. Generated Schedule View (rounds with match cards)
5. Statistics Dashboard (partner/opponent matrices, rest distribution)

## Typography Hierarchy

**Fonts**: Poppins (headings), Inter (body) via Google Fonts

**Scale**
- Page Title: `text-4xl font-bold`
- Section Headers: `text-2xl font-semibold`
- Round Labels: `text-xl font-medium`
- Match Details: `text-base`
- Player Names: `text-lg font-medium`
- Stats/Metadata: `text-sm`

## Spacing System

**Tailwind Units**: Consistently use 2, 4, 6, 8, 12, 16
- Component internal: `p-4` or `p-6`
- Section gaps: `space-y-8` or `space-y-12`
- Card margins: `gap-4` or `gap-6`
- Element spacing: `mb-2`, `mt-4`, `mx-2`

## Component Library

**Player Input Section**
- Individual input fields in grid: `grid-cols-1 sm:grid-cols-2 gap-4`
- Text inputs with labels above
- Add/remove player buttons inline with inputs
- Player count indicator prominently displayed

**Match Cards** (primary component)
- Bordered cards with rounded corners: `rounded-lg border-2`
- Structure: Court label → Team 1 (2 players) vs Team 2 (2 players)
- Clear vs separator between teams
- Compact but readable: `p-4 space-y-2`
- Player names in badge-style pills: `inline-block px-3 py-1 rounded-full`

**Round Containers**
- Each round in distinct section
- Round header with number: "Round 1", "Round 2"
- Match cards in responsive grid below
- Rest indicators showing which players are sitting out

**Statistics Tables**
- Clean table layout with headers
- Row-based data showing: Player | Partners | Opponents | Matches Played | Rests
- Highlight cells for visual scanning
- Totals/summary row at bottom

**Action Buttons**
- Primary button (Generate Schedule): `px-8 py-3 rounded-lg font-semibold text-lg`
- Secondary buttons (Reset, etc.): `px-4 py-2 rounded`
- Icon + text combinations for clarity

**Status Indicators**
- Badge components for player states: "Playing", "Resting"
- Numerical badges for match counts
- Visual indicators for balance (e.g., "All players matched evenly")

## Interaction Patterns

**Progressive Disclosure**
- Input section collapses after schedule generation
- Expand button to modify players
- Statistics section toggleable/expandable

**Visual Feedback**
- Form validation on player inputs (minimum 4, maximum 10)
- Loading state during schedule generation
- Success state when schedule complete
- Empty state with instructions before generation

**Data Visualization**
- Color-coded (by system, not specified here) partner frequency
- Visual indicators for rest distribution equity
- Clear delineation between rounds

## Responsive Behavior

**Mobile (base)**
- Single column layout throughout
- Stack match cards vertically
- Simplified statistics (scrollable table)
- Full-width buttons

**Tablet (md:)**
- Two-column match card grid
- Side-by-side stats where appropriate

**Desktop (lg:)**
- Three-column match card grid for optimal viewing
- Full statistics dashboard
- Horizontal layout for controls

## Accessibility
- High contrast text
- Clear focus states on all inputs and buttons
- Semantic HTML for screen readers
- Keyboard navigation support
- Descriptive labels for all form fields
- ARIA labels for dynamic content updates

## Animation Guidelines
**Minimal, purposeful only**
- Smooth collapse/expand transitions: `transition-all duration-300`
- Fade-in for generated schedule
- No decorative animations
- Focus on instant feedback over flourish

**No Images Required**: This is a utility tool focused on data display and interaction. Visual interest comes from clean typography, organized layout, and structured data presentation rather than imagery.