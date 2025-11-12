-- Create modules table in Supabase
create table modules (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  version text not null,
  status text check (status in ('active', 'inactive')) default 'inactive',
  config jsonb default '{}',
  module_path text,
  icon text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create reservations table
create table reservations (
  id serial primary key,
  guest_name text not null,
  room_number integer,
  check_in date,
  check_out date,
  status text check (status in ('booked', 'checked_in', 'checked_out', 'cancelled')) default 'booked',
  room_type text,
  created_at timestamptz default now()
);

-- Create rooms table
create table rooms (
  id serial primary key,
  number integer unique not null,
  type text not null,
  status text check (status in ('available', 'occupied', 'maintenance', 'dirty', 'cleaning')) default 'available',
  price numeric not null,
  created_at timestamptz default now()
);

-- Create housekeeping table
create table housekeeping (
  id serial primary key,
  room_number integer not null,
  assigned_to text,
  status text check (status in ('pending', 'in_progress', 'done')) default 'pending',
  updated_at timestamptz default now()
);

-- Create packages table
create table packages (
  id serial primary key,
  name text not null,
  description text,
  price numeric not null,
  duration integer not null, -- in nights
  includes text[],
  available_from date,
  available_to date,
  max_guests integer,
  status text check (status in ('active', 'inactive')) default 'active',
  created_at timestamptz default now()
);

-- Create events table
create table events (
  id serial primary key,
  name text not null,
  description text,
  date date not null,
  start_time time,
  end_time time,
  capacity integer,
  price numeric,
  type text check (type in ('conference', 'wedding', 'party', 'corporate', 'other')),
  status text check (status in ('upcoming', 'ongoing', 'completed', 'cancelled')) default 'upcoming',
  created_at timestamptz default now()
);

-- Insert sample data
insert into rooms (number, type, status, price) values
(101, 'Standard', 'available', 100),
(102, 'Deluxe', 'occupied', 150),
(103, 'Suite', 'available', 200);

insert into reservations (guest_name, room_number, check_in, check_out, status) values
('John Doe', 101, '2024-11-15', '2024-11-17', 'booked'),
('Jane Smith', 102, '2024-11-10', '2024-11-12', 'checked_in');

-- Insert existing modules
insert into modules (name, version, status, module_path, icon) values
('Reservations', '1.0.0', 'active', '@/modules/reservations/index', 'calendar'),
('Housekeeping', '1.0.0', 'active', '@/modules/housekeeping/index', 'broom'),
('Front Desk', '1.0.0', 'active', '@/modules/front-desk/index', 'usercheck'),
('Billing', '1.0.0', 'active', '@/modules/billing/index', 'creditcard'),
('Rooms', '1.0.0', 'active', '@/modules/rooms/index', 'home'),
('Reports', '1.0.0', 'active', '@/modules/reports/index', 'barchart'),
('AI Concierge', '1.0.0', 'active', '@/modules/ai-concierge/index', 'message'),
('AI Revenue Manager', '1.0.0', 'active', '@/modules/ai-revenue-manager/index', 'trending'),
('Packages & Events', '1.0.0', 'active', '@/modules/packages-events/index', 'package');