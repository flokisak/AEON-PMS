# PMS System

A modular Property Management System built with Next.js, TypeScript, Supabase, and Tailwind CSS.

## Features

- **Modular Architecture**: Easily extensible with new modules (Reservations, Housekeeping, etc.)
- **Authentication**: Supabase Auth with magic link login
- **Database**: Supabase for data storage and real-time updates
- **UI**: Tailwind CSS for responsive design
- **State Management**: TanStack Query for server state

## Modules

- **Reservations**: Manage hotel reservations with CRUD operations
- **Housekeeping**: Track housekeeping tasks

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL to create tables (see below)
   - Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials
4. Run the development server: `npm run dev`

## Supabase Tables

```sql
create table reservations (
  id serial primary key,
  guest_name text,
  room_number int,
  status text check (status in ('booked','checked_in','checked_out','cancelled')),
  created_at timestamptz default now()
);

create table housekeeping (
  id serial primary key,
  room_number int,
  assigned_to text,
  status text check (status in ('pending','in_progress','done')),
  updated_at timestamptz default now()
);
```

## Project Structure

- `core/`: Shared components, config, and utilities
- `modules/`: Feature-specific modules
- `app/`: Next.js app router pages

## Adding New Modules

1. Create a new folder in `modules/`
2. Add entry to `core/moduleRegistry.ts`
3. Implement logic, UI, and page components
