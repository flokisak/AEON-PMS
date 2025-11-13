-- COMPLETE HOTEL PMS SCHEMA
-- Fixed version with all modules and proper foreign keys

-- Drop everything to start fresh
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;
DROP TABLE IF EXISTS current_guests CASCADE;
DROP VIEW IF EXISTS current_guests;
DROP TABLE IF EXISTS modules CASCADE;
DROP TABLE IF EXISTS housekeeping CASCADE;
DROP TABLE IF EXISTS packages CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS guest_accounts CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS room_service_orders CASCADE;
DROP TABLE IF EXISTS maintenance_requests CASCADE;
DROP TABLE IF EXISTS reports CASCADE;

-- Core tables
CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number INTEGER NOT NULL UNIQUE,
    room_type_id UUID REFERENCES room_types(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'dirty', 'cleaning')),
    capacity INTEGER NOT NULL DEFAULT 2,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name VARCHAR(200) NOT NULL,
    guest_email VARCHAR(200),
    guest_phone VARCHAR(50),
    nationality VARCHAR(3) DEFAULT 'CZ',
    passport_number VARCHAR(50),
    number_of_guests INTEGER DEFAULT 1,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    room_type_id UUID REFERENCES room_types(id) ON DELETE SET NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'checked_in', 'checked_out', 'cancelled', 'no_show')),
    total_amount DECIMAL(10,2),
    paid_amount DECIMAL(10,2) DEFAULT 0,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_dates CHECK (check_out > check_in)
);

-- Module registry
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    version TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'inactive',
    config JSONB DEFAULT '{}',
    module_path TEXT,
    icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Housekeeping module
CREATE TABLE housekeeping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    assigned_to TEXT,
    status TEXT CHECK (status IN ('pending', 'in_progress', 'done')) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Packages & Events module
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration INTEGER NOT NULL, -- in nights
    includes TEXT[],
    available_from DATE,
    available_to DATE,
    max_guests INTEGER,
    status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    capacity INTEGER,
    price DECIMAL(10,2),
    type TEXT CHECK (type IN ('conference', 'wedding', 'party', 'corporate', 'other')),
    status TEXT CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employee Management module
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    position TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    hire_date DATE NOT NULL,
    salary DECIMAL(10,2),
    status TEXT CHECK (status IN ('active', 'inactive', 'on_leave')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Billing module
CREATE TABLE guest_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    guest_phone TEXT,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    balance DECIMAL(10,2) DEFAULT 0,
    status TEXT CHECK (status IN ('active', 'closed', 'suspended')) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_account_id UUID REFERENCES guest_accounts(id) ON DELETE CASCADE,
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    invoice_number TEXT UNIQUE NOT NULL,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
    guest_account_id UUID REFERENCES guest_accounts(id) ON DELETE SET NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'online')) NOT NULL,
    payment_date TIMESTAMPTZ DEFAULT NOW(),
    status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
    transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Room Service module
CREATE TABLE room_service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    items JSONB NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'preparing', 'delivered', 'cancelled')) DEFAULT 'pending',
    order_time TIMESTAMPTZ DEFAULT NOW(),
    delivery_time TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance module
CREATE TABLE maintenance_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'open',
    assigned_to TEXT,
    reported_date TIMESTAMPTZ DEFAULT NOW(),
    completed_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports module
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    report_type TEXT NOT NULL,
    report_date DATE NOT NULL,
    data JSONB NOT NULL,
    generated_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Views
CREATE OR REPLACE VIEW current_guests AS
SELECT 
    r.*,
    rm.room_number as assigned_room,
    rt.name as room_type
FROM reservations r
LEFT JOIN rooms rm ON r.room_id = rm.id
LEFT JOIN room_types rt ON r.room_type_id = rt.id
WHERE r.status = 'checked_in'
ORDER BY r.check_in DESC;

-- Insert sample data
INSERT INTO room_types (name, base_price) VALUES 
('Standard', 100.00),
('Deluxe', 150.00),
('Suite', 200.00);

INSERT INTO rooms (room_number, room_type_id, status, price) 
SELECT 101 + ROW_NUMBER() OVER () - 1, id, 'available', base_price
FROM room_types;

INSERT INTO modules (name, version, status, module_path, icon) VALUES
('Reservations', '1.0.0', 'active', '@/modules/reservations/index', 'calendar'),
('Housekeeping', '1.0.0', 'active', '@/modules/housekeeping/index', 'broom'),
('Front Desk', '1.0.0', 'active', '@/modules/front-desk/index', 'usercheck'),
('Billing', '1.0.0', 'active', '@/modules/billing/index', 'creditcard'),
('Rooms', '1.0.0', 'active', '@/modules/rooms/index', 'home'),
('Reports', '1.0.0', 'active', '@/modules/reports/index', 'barchart'),
('AI Concierge', '1.0.0', 'active', '@/modules/ai-concierge/index', 'message'),
('AI Revenue Manager', '1.0.0', 'active', '@/modules/ai-revenue-manager/index', 'trending'),
('Packages & Events', '1.0.0', 'active', '@/modules/packages-events/index', 'package'),
('Employee Management', '1.0.0', 'active', '@/modules/employee-management/index', 'users');

-- Final verification
SELECT 
    'SUCCESS' as final_status,
    'Complete Hotel PMS schema created' as message,
    (SELECT COUNT(*) FROM room_types) as room_types_count,
    (SELECT COUNT(*) FROM rooms) as rooms_count,
    (SELECT COUNT(*) FROM reservations) as reservations_count,
    (SELECT COUNT(*) FROM modules) as modules_count,
    (SELECT COUNT(*) FROM current_guests) as current_guests_count;