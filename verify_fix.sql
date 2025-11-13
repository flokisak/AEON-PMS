-- Quick Test Schema - Verify the fix works
-- This should run without any foreign key errors

-- Drop tables if they exist (for testing)
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;

-- Room Types Table
CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms Table (with room_number instead of number)
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number INTEGER NOT NULL UNIQUE,
    room_type_id UUID REFERENCES room_types(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    capacity INTEGER NOT NULL DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations Table (referencing room_id UUID)
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name VARCHAR(200) NOT NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'booked',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test data
INSERT INTO room_types (name, base_price) VALUES ('Standard', 100.00);
INSERT INTO rooms (room_number, room_type_id, status, capacity) VALUES (101, (SELECT id FROM room_types LIMIT 1), 'available', 2);
INSERT INTO reservations (guest_name, room_id, check_in, check_out) VALUES ('Test Guest', (SELECT id FROM rooms WHERE room_number = 101), CURRENT_DATE, CURRENT_DATE + 1);

-- Verify data
SELECT 'Room Types' as table_name, COUNT(*) as count FROM room_types
UNION ALL
SELECT 'Rooms', COUNT(*) FROM rooms
UNION ALL  
SELECT 'Reservations', COUNT(*) FROM reservations;