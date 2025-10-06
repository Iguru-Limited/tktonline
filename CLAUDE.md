# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

tkt.ke is a Next.js 15 travel ticket booking application for Kenya, allowing users to search for buses, select seats, and complete bookings with mobile money payments (M-Pesa/Airtel).

## Commands

### Development
```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production with Turbopack
npm start            # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix linting issues
```

### Adding UI Components
```bash
npx shadcn@latest add <component-name>  # Add shadcn/ui components
```

The project uses shadcn/ui with the "new-york" style and has MCP server integration configured for shadcn commands.

## Architecture

### State Management

The application uses React Context for global state:

- **SearchContext** (`src/contexts/SearchContext.tsx`): Manages search parameters (from, to, tripType, dates)
- **BookingContext** (`src/contexts/BookingContext.tsx`): Manages the complete booking flow including:
  - Provider selection
  - Vehicle selection
  - Seat selection (with total amount calculation)
  - Customer details
  - Payment details
  - Booking reference generation

Both contexts wrap the entire app in `src/app/layout.tsx`.

### Routing Structure

Next.js App Router with the following pages:
- `/` - Home page with search form
- `/providers` - List of available transport providers
- `/booking` - Multi-step booking flow (seat selection, customer details, payment)
- `/login` - Authentication page

### Booking Flow

1. User searches from home page → SearchContext stores search data
2. Navigates to `/providers` → User selects provider
3. Navigates to `/booking` → Multi-step process:
   - Select vehicle and seats
   - Enter customer details (name, ID, phone)
   - Complete payment (M-Pesa/Airtel/Cash)
   - Generate booking reference and ticket

### Key Components

- **Custom Components** (`src/components/`):
  - `desktop-header.tsx` / `mobile-header.tsx` - Responsive navigation
  - `seat-selection.tsx` - Interactive bus seat picker
  - `payment-form.tsx` - Mobile money payment form
  - `ticket-receipt.tsx` - Booking confirmation display
  - `login-form.tsx` - Authentication form
  - `departure_date_picker/` - Date selection component

- **UI Components** (`src/components/ui/`): shadcn/ui components (Button, Card, Input, Dialog, etc.)

### Utilities

- **ticketGenerator.ts** (`src/utils/`): Generates PDF tickets using jsPDF and HTML receipt strings
  - `generateTicketPDF()` - Creates downloadable PDF ticket
  - `generateReceiptHTML()` - Returns HTML receipt for display

### Styling

- Tailwind CSS v4 with PostCSS
- shadcn/ui theming with CSS variables (slate base color)
- Path alias: `@/*` maps to `src/*`
- Utility function: `cn()` in `src/lib/utils.ts` for className merging

### TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- Path aliases configured (`@/*` → `src/*`)
- Next.js plugin enabled for type checking

### PWA Support

The app includes PWA configuration with manifest and service worker setup (via next-pwa dependency).

## Key Patterns

- All client components must use `"use client"` directive
- Form validation uses react-hook-form with zod resolvers
- Date handling with date-fns library
- Motion/animations via Framer Motion (motion package)
- Toast notifications via Sonner
- Icons from Lucide React
