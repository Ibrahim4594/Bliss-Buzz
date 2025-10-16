# Bliss Buzz - AI-Powered Meditation App

## Overview

Bliss Buzz is a revolutionary AI-powered meditation web application that transforms mental wellness through personalized, immersive experiences. The app analyzes users' emotional states and creates customized meditation sessions with interactive breathwork exercises, immersive 2D environments, and AI-generated guided meditations. Built with a React frontend and Express backend, it emphasizes serene design, emotional intelligence, and progressive user experiences.

## Recent Changes (October 16, 2025)

### ✅ Complete Implementation
- **URL-based routing refactor**: Migrated from state-based navigation to proper URL routes for better UX and testability
- **Full AI integration**: OpenAI GPT-4o-mini generates personalized meditation scripts based on emotional state
- **Complete backend**: All API endpoints implemented with in-memory storage and automatic stats calculation
- **Comprehensive testing**: E2E tests passing for complete meditation journey, dashboard analytics, and theme toggling
- **3D Immersive Environments**: Added Three.js integration with photorealistic 3D scenes (bamboo forest, ocean depths, aurora sky, temple garden). Includes WebGL detection and graceful fallback to 2D gradients when WebGL is unavailable (e.g., headless testing environments)
- **Binaural Beats & Audio Engine**: Integrated Tone.js for binaural beats generation with Alpha (10Hz), Theta (6Hz), and Delta (2Hz) frequencies. Includes volume controls, mute/unmute, and frequency selection during meditation
- **Production-ready**: Application fully functional and ready for deployment

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18** with functional components and hooks for UI state management
- **TypeScript** for type safety across the application
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing with URL-based navigation
- **TanStack Query (React Query)** for server state management and data fetching

**UI Framework:**
- **shadcn/ui** component library based on Radix UI primitives
- **Tailwind CSS** for styling with custom design tokens
- **Design System**: Implements a "Reference-Based Hybrid" approach drawing from Calm, Headspace, Linear, and Stripe aesthetics
- **Theme Support**: Full dark/light mode with custom color palettes optimized for meditation experiences

**Routing Structure:**
- `/` - Homepage with hero section and journey start
- `/meditate` - Multi-step meditation flow (mood → environment → breathwork → session)
- `/dashboard` - Analytics dashboard with session history and statistics
- `/zen-sparks` - Quick meditation library for instant sessions

**State Management Pattern:**
- Server state managed via React Query with custom query client
- Local UI state handled with React hooks (useState, useEffect)
- Theme context using React Context API with localStorage persistence
- Multi-step flows in /meditate managed with local state machine
- URL-based routing for shareable, bookmarkable pages

**Key Features:**
- Emotion Intelligence Engine with 6-emotion mood check-in system
- Interactive breathwork visualization using HTML5 Canvas with particle systems
- Immersive environment selection (bamboo forest, ocean waves, aurora borealis, zen temple)
- **3D Mode Toggle**: Switch between 2D gradients and photorealistic 3D environments during meditation
- **Binaural Beats Audio**: Frequency selection (Alpha/Theta/Delta) with volume controls and mute for deep meditation states
- Real-time meditation player with AI-generated scripts and progress tracking
- Analytics dashboard with Recharts visualizations (weekly activity, progress trends)
- Zen Sparks library for quick 2-5 minute meditation sessions
- Global navigation with intelligent hiding during active meditation

### Backend Architecture

**Technology Stack:**
- **Express.js** server with TypeScript
- **Node.js** runtime environment
- **ESM modules** for modern JavaScript imports

**API Design:**
- RESTful endpoints under `/api` prefix
- JSON request/response format
- Error handling middleware with standardized error responses
- Request logging with timing metrics

**Core Endpoints:**
- `POST /api/meditation/generate` - AI meditation script generation
- Session and mood tracking endpoints
- User statistics aggregation

**AI Integration:**
- **OpenAI GPT-4o-mini** integration for personalized meditation script generation
- Dynamic prompts based on mood states (anxious, stressed, overwhelmed, restless, tired, peaceful)
- Context-aware meditation duration adjustment
- Natural language processing for empathetic guidance

### Data Storage Solutions

**ORM & Schema:**
- **Drizzle ORM** for type-safe database operations
- **Zod schemas** for runtime validation derived from Drizzle schemas
- PostgreSQL dialect configuration (designed for Neon Database)

**Data Models:**
- `meditationSessions` - Tracks completed meditation sessions with mood, duration, script, and environment
- `moodRecords` - Logs emotional check-ins with timestamps for pattern analysis
- `userStats` - Aggregates user progress metrics (total sessions, minutes, streaks)

**Storage Strategy:**
- In-memory storage implementation (`MemStorage`) for development/fallback
- Interface-based storage pattern (`IStorage`) allows for database backend swapping
- UUID-based primary keys for all entities

**Session Tracking:**
- Completion timestamps for meditation sessions
- Mood pattern analysis over time
- Streak calculation and milestone tracking

### External Dependencies

**AI Services:**
- **OpenAI API** - GPT-4o-mini model for meditation script generation
- Environment variables: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`

**Database:**
- **Neon Database** (PostgreSQL) - Serverless PostgreSQL via `@neondatabase/serverless`
- Environment variable: `DATABASE_URL`
- Connection pooling for serverless environments

**UI Component Libraries:**
- **Radix UI** - Comprehensive set of accessible, unstyled components (accordion, dialog, dropdown, slider, etc.)
- **Recharts** - Chart library for dashboard visualizations
- **Embla Carousel** - Carousel/slider functionality
- **cmdk** - Command palette component
- **Lucide React** - Icon library
- **Three.js & React Three Fiber** - 3D graphics rendering with React integration (v0.166.1, v8.17.10)
- **@react-three/drei** - Helper components for Three.js (v9.114.3)
- **Tone.js** - Web Audio API library for binaural beats generation and audio synthesis

**Development Tools:**
- **Replit-specific plugins** for dev environment integration
- **Vite plugins** for runtime error overlay and development banners
- **TSX** for TypeScript execution in development
- **Drizzle Kit** for database migrations

**Session Management:**
- **connect-pg-simple** - PostgreSQL session store for Express sessions (configured but not actively used in codebase)

**Styling & Utilities:**
- **class-variance-authority** - Component variant handling
- **clsx** & **tailwind-merge** - Conditional className management
- **date-fns** - Date manipulation and formatting
- **React Hook Form** with **Zod resolvers** - Form validation

**Font Integration:**
- **Google Fonts** - Inter (primary UI font) and Crimson Pro (accent font)
- Preconnected font loading for performance