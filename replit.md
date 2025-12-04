# Student Roster Management Application

## Overview

This is a Thai-language student roster management web application designed for classroom use. The system allows teachers to manage student information including names, student IDs, phone numbers, and birthdays. It features a modern, data-focused UI with comprehensive CRUD operations, search/filter capabilities, birthday tracking, and data export functionality.

The application is built as a full-stack TypeScript project with a React frontend and Express backend, using in-memory storage for student data (with optional PostgreSQL support via Drizzle ORM).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query (React Query)** for server state management and data fetching

**UI Component System**
- **shadcn/ui** component library (Radix UI primitives + Tailwind CSS)
- **New York** variant style with custom theme configuration
- **Tailwind CSS** for styling with custom color system and spacing utilities
- Components are fully typed and follow a consistent design system

**State Management Strategy**
- Server state managed via TanStack Query with optimistic updates
- Local UI state managed with React hooks (useState, useMemo)
- No global state management library (Redux, Zustand) - keeping it simple
- Theme state managed via context (light/dark/system modes)

**Key Design Patterns**
- Component composition with shadcn/ui primitives
- Custom hooks for reusable logic (useToast, useIsMobile, useTheme)
- Form validation using React Hook Form + Zod resolvers
- Separation of presentation (UI components) and business logic

**Thai Language Support**
- **Inter** and **Noto Sans Thai** fonts for optimal Thai character rendering
- All UI text, labels, and messages in Thai
- Custom date formatting utilities for Thai Buddhist calendar (BE)
- Thai month names and locale-specific formatting

### Backend Architecture

**Server Framework**
- **Express.js** for HTTP server and API routing
- **Node.js** with TypeScript and ES Modules
- Custom logging middleware for request tracking
- Static file serving for production builds

**API Design**
- RESTful API structure with `/api/students` endpoints
- JSON request/response format
- CRUD operations: GET all, GET by ID, POST, PUT, DELETE
- Error handling with appropriate HTTP status codes
- Validation using Zod schemas shared between client and server

**Data Layer**
- **Current Implementation**: In-memory storage with `MemStorage` class
- **Prepared for**: PostgreSQL via Drizzle ORM (configuration exists but not actively used)
- Initial seed data with 30+ Thai student records
- Type-safe data models using Zod schemas

**Why In-Memory Storage?**
- Simplicity for classroom/demo use cases
- No external database dependencies required
- Easy to reset and seed with sample data
- Can be swapped for Drizzle ORM implementation without API changes

### Data Storage Solutions

**Current Storage: In-Memory Map**
- `IStorage` interface defines storage contract
- `MemStorage` implementation using JavaScript Map
- Data persists only during server runtime (resets on restart)
- Includes 30+ pre-seeded Thai student records for demo purposes

**Database Ready: PostgreSQL + Drizzle ORM**
- Drizzle ORM configured and ready to use
- Schema defined in `shared/schema.ts`
- Migration system configured (`drizzle.config.ts`)
- Neon Database serverless driver included
- Can be activated by implementing Drizzle-based storage class

**Data Model**
```typescript
Student {
  id: string (UUID)
  name: string (Thai name with title)
  studentId: string (5-digit school ID)
  phone: string (10-digit Thai mobile)
  birthday: string (d/m/yyyy format, Buddhist Era)
}
```

**Validation Strategy**
- Shared Zod schemas between client and server (`shared/schema.ts`)
- Type inference for TypeScript types from Zod schemas
- Runtime validation on API requests
- Form validation on client side using same schemas

### Authentication and Authorization

**Current State: No Authentication**
- No user authentication system implemented
- No authorization or access control
- Single-user classroom tool assumption
- All API endpoints publicly accessible

**Why No Auth?**
- Designed for trusted classroom environments
- Focus on simplicity and ease of use
- Can be added later if needed (passport.js dependencies already included)

**Future Enhancement Path**
- Express session middleware configured (`express-session`, `connect-pg-simple`)
- Passport.js included in dependencies
- Ready for local authentication strategy if required

## External Dependencies

### Core Dependencies

**Frontend Framework & Libraries**
- `react`, `react-dom` - UI library
- `@tanstack/react-query` - Server state management
- `wouter` - Routing
- `react-hook-form` - Form handling
- `@hookform/resolvers` - Form validation integration
- `zod` - Schema validation

**UI Component Libraries**
- `@radix-ui/*` - Headless UI primitives (20+ components)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Component variant utilities
- `clsx`, `tailwind-merge` - Conditional class merging
- `lucide-react` - Icon library
- `date-fns` - Date manipulation

**Backend Framework**
- `express` - Web server framework
- `drizzle-orm` - SQL ORM (prepared for use)
- `@neondatabase/serverless` - PostgreSQL driver
- `zod` - Schema validation (shared with frontend)

**Development Tools**
- `vite` - Build tool and dev server
- `typescript` - Type system
- `tsx` - TypeScript execution
- `esbuild` - Server bundler
- `drizzle-kit` - Database migrations

### Third-Party Services

**Database (Optional)**
- **Neon Database** - Serverless PostgreSQL
- Environment variable: `DATABASE_URL`
- Currently not required due to in-memory storage
- Can be provisioned when persistent storage is needed

**No External APIs**
- No authentication providers
- No analytics services
- No payment processors
- No email services
- Self-contained application

### Build & Deployment Configuration

**Development Mode**
- Vite dev server with HMR on port 5173
- Express API server (proxied through Vite)
- TypeScript compilation on-the-fly
- Replit-specific plugins for development banner and error overlay

**Production Build**
- Client: Vite build to `dist/public`
- Server: esbuild bundle to `dist/index.cjs`
- Static file serving from Express
- Optimized dependency bundling (allowlist strategy)

**Environment Variables**
- `NODE_ENV` - development/production mode
- `DATABASE_URL` - PostgreSQL connection (optional)
- `PORT` - Server port (defaults from Replit)