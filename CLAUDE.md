# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Development
```bash
pnpm dev          # Start Next.js development server
pnpm build        # Build for production (includes Prisma generate)
pnpm start        # Start production server
```

### Code Quality
```bash
pnpm lint         # Run Next.js linter
pnpm format       # Format code with Prettier
pnpm check:types  # Run TypeScript type checking
pnpm check:all    # Run all checks (lint, types, spelling, format)
pnpm pre-commit   # Run pre-commit checks
```

### Database
```bash
pnpm db:migrate:dev  # Run Prisma migrations in development
pnpm db:seed         # Seed the database
pnpm db:reset:full   # Full database reset (drop, migrate, seed)
```

### Testing
```bash
pnpm test         # Run tests with Vitest
pnpm test:watch   # Run tests in watch mode
```

## Architecture Overview

This is a TypeScript web application using:
- **Frontend**: Next.js 15 (App Router) + React 19 + Tailwind CSS + shadcn/ui
- **Backend**: Hono API framework with Domain-Driven Design
- **Database**: PostgreSQL via Supabase + Prisma ORM
- **Auth**: Supabase Auth (transitioning implementation)
- **State**: Zustand for client state management

### Directory Structure

**Frontend (Next.js)**
- `/app` - Next.js App Router pages and API routes
- `/components` - UI components using shadcn/ui
- `/hooks` - Custom React hooks
- `/stores` - Zustand state stores
- `/providers` - React context providers

**Backend (Domain-Driven Design)**
- `/backend/domain` - Business entities and repository interfaces
- `/backend/application` - Use cases and business logic
- `/backend/infrastructure` - Database implementation (Prisma)
- `/backend/handlers` - API request handlers
- `/backend/hono` - Hono app configuration (public, private, mypage apps)

**Shared**
- `/shared/schemas` - Zod schemas for API validation
- `/lib/routing` - Type-safe routing system

### API Structure

The Hono API is mounted at `/api/[...route]` and consists of:
- `publicApp` - Public endpoints (no auth required)
- `privateApp` - Admin endpoints (requires admin role)
- `mypageApp` - User-specific endpoints (requires authentication)

All APIs use Zod for validation and OpenAPI for documentation.

### Authentication Flow

The app is transitioning to Supabase Auth:
- Session management in `/backend/lib/auth/session.ts`
- Middleware for route protection in `/backend/lib/auth/middleware.ts`
- Client-side auth store in `/stores/authStore.ts`

### Database Schema

Complex multi-tenant structure with:
- Users, Groups, Teams
- Role-Based Access Control (RBAC)
- Subscription/Billing system
- Activity logging

## Important Constraints

From `.cursorrules`:
- DO NOT change API/framework versions without explicit approval
- DO NOT create duplicate implementations - search existing code first
- UI/UX changes require user approval
- Follow the established directory structure strictly
- Use existing patterns and utilities

## Development Workflow

1. Always run `pnpm check:all` before committing
2. Database changes require migration: `pnpm db:migrate:dev`
3. Use type-safe routing via `/lib/routing` instead of hard-coded paths
4. Validate all API inputs/outputs with Zod schemas in `/shared/schemas`
5. Follow DDD principles for backend code organization