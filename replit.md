# Badminton Round Robin Scheduler

## Overview

This is a single-page web application for creating balanced badminton doubles schedules. The application generates fair round-robin tournaments for 4-10 players, ensuring equitable partner pairings, opponent distributions, and rest periods. It's designed as an information-dense, utility-focused tool with Material Design principles for clarity and ease of use.

The app is entirely client-side with a minimal backend infrastructure. Currently implements in-memory storage with a placeholder database schema (users table) that is not actively used by the scheduling functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Tooling**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query** (React Query) for state management and API interactions

**UI Component System**
- **shadcn/ui** component library (New York style variant) built on Radix UI primitives
- **Tailwind CSS** for utility-first styling with custom design tokens
- **Class Variance Authority (CVA)** for component variant management
- Typography uses Poppins for headings and Inter for body text

**Design System**
- Card-based layout with consistent spacing units (2, 4, 6, 8, 12, 16)
- Maximum container width of 6xl (72rem) with responsive grid layouts
- Material Design-inspired with focus on information density
- CSS custom properties for theming with HSL color system supporting light/dark modes

**State Management Approach**
- Client-side state for scheduling algorithm and UI interactions
- No persistent storage currently implemented for schedules
- Match scores tracked locally with Map data structure
- Collapsible sections for improved UX after schedule generation

**Key Components**
- `PlayerInput`: Dynamic player list management (4-10 players) with add/remove functionality
- `MatchCard`: Individual match display with team composition and score tracking controls
- `RoundDisplay`: Groups matches by round with resting player indicators
- `StatsTable`: Expandable player statistics showing partners, opponents, and match history

### Backend Architecture

**Server Framework**
- **Express.js** with TypeScript for API server
- Separate development and production entry points (`index-dev.ts`, `index-prod.ts`)
- Development mode integrates Vite middleware for HMR (Hot Module Replacement)
- Production mode serves pre-built static assets from `dist/public`

**Request Handling**
- JSON body parsing with raw body preservation for webhook verification
- Request logging middleware tracking API call duration and response status
- Routes prefixed with `/api` (currently minimal route implementation)

**Storage Interface**
- Abstract `IStorage` interface defining CRUD operations
- `MemStorage` implementation providing in-memory data persistence
- Designed for future database integration without changing application code

**Session Management**
- Infrastructure includes `connect-pg-simple` for PostgreSQL session storage
- Session configuration not actively implemented in current codebase

### Data Storage Solutions

**Current State**
- **In-Memory Storage**: `MemStorage` class using JavaScript Map for user data
- No persistence between server restarts
- Scheduling data remains entirely client-side

**Database Schema (Configured but Unused)**
- **Drizzle ORM** with PostgreSQL dialect configured
- Single `users` table with id (UUID), username (unique), and password fields
- Schema defined in `shared/schema.ts` with Zod validation schemas
- Migration output directory: `./migrations`

**Database Provider**
- **Neon Serverless PostgreSQL** adapter included in dependencies
- Connection configured via `DATABASE_URL` environment variable
- Database not currently provisioned or used by the application

**Future Storage Considerations**
- Schedule persistence would require new tables for tournaments, rounds, matches, and player statistics
- User authentication system ready for implementation with existing schema
- Session storage infrastructure prepared for multi-user scenarios

### Authentication & Authorization

**Current State**
- No authentication implemented
- User schema exists but is not integrated into application flow
- No protected routes or user-specific data

**Prepared Infrastructure**
- Password field in user schema (hashing strategy not implemented)
- Session middleware dependencies installed but not configured
- `apiRequest` utility supports credential inclusion for future auth cookies

### Scheduling Algorithm

**Implementation Location**
- Client-side algorithm in `client/src/pages/Scheduler.tsx`
- `generateMockSchedule` function creates equitable round-robin distributions

**Algorithm Objectives**
- Equal match distribution across all players
- Balanced partner pairings (minimize repeat partnerships)
- Fair opponent distribution (play against all players roughly equally)
- Even rest period allocation when player count doesn't divide evenly into matches

**Current Approach**
- Calculates dynamic round count to ensure divisibility for equal play
- Tracks partner frequency, opponent frequency, matches played, and rest periods
- Uses greedy selection with fairness heuristics to build match pairings
- Attempts to optimize for least-played partners and least-faced opponents

**Limitations**
- Marked as "TODO" for replacement with production algorithm
- May not achieve perfect mathematical optimality for all player counts
- No backtracking or constraint satisfaction solver currently implemented

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Comprehensive suite of unstyled, accessible component primitives (accordion, dialog, dropdown, popover, select, slider, switch, tabs, toast, tooltip, etc.)
- **Embla Carousel**: Touch-friendly carousel component
- **cmdk**: Command palette/menu component
- **Lucide React**: Icon library for UI elements

### Development Tools
- **TypeScript**: Static type checking across entire codebase
- **ESBuild**: Fast bundler for production server build
- **PostCSS**: CSS processing with Autoprefixer
- **Drizzle Kit**: Database migration management CLI

### Utility Libraries
- **clsx** & **tailwind-merge**: Class name composition and merging
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation for development HMR cache busting
- **Zod**: Runtime type validation and schema definition
- **React Hook Form**: Form state management with resolver integration

### Replit-Specific Plugins
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Code navigation enhancement
- **@replit/vite-plugin-dev-banner**: Development environment banner

### Database & ORM
- **Drizzle ORM**: Type-safe SQL query builder
- **@neondatabase/serverless**: PostgreSQL client for edge/serverless environments
- **drizzle-zod**: Automatic Zod schema generation from Drizzle schemas
- **connect-pg-simple**: PostgreSQL session store for Express

### Path Aliases
- `@/*` resolves to `client/src/*`
- `@shared/*` resolves to `shared/*`
- `@assets/*` resolves to `attached_assets/*`