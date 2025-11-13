-- Test Schema - Minimal version to check for syntax errors
-- This creates just the essential tables to verify the fix

-- Room Types Table
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms Table (fixed: renamed to room_number to avoid reserved keyword)
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number INTEGER NOT NULL UNIQUE,
    room_type_id UUID REFERENCES room_types(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'maintenance', 'cleaning', 'out_of_order')),
    capacity INTEGER NOT NULL DEFAULT 2,
    size INTEGER,
    floor INTEGER NOT NULL,
    description TEXT,
    last_cleaned TIMESTAMP WITH TIME ZONE,
    next_maintenance TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations Table (fixed: room_id reference using UUID)
CREATE TABLE IF NOT EXISTS reservations (
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

-- Test data
INSERT INTO room_types (name, base_price, description) VALUES 
('Standard Room', 100.00, 'Comfortable standard room'),
('Deluxe Room', 150.00, 'Spacious deluxe room with amenities');

INSERT INTO rooms (room_number, room_type_id, status, capacity, floor) VALUES 
(101, (SELECT id FROM room_types WHERE name = 'Standard Room'), 'available', 2, 1),
(102, (SELECT id FROM room_types WHERE name = 'Deluxe Room'), 'available', 2, 1);

INSERT INTO reservations (guest_name, guest_email, room_id, check_in, check_out, total_amount) VALUES 
('John Doe', 'john@example.com', (SELECT id FROM rooms WHERE room_number = 101), CURRENT_DATE, CURRENT_DATE + INTERVAL '2 days', 200.00);