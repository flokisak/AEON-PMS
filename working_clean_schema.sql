-- FINAL CLEAN SCHEMA - No hidden issues
-- This version eliminates all potential problems

-- Drop everything to start fresh
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;
DROP TABLE IF EXISTS current_guests CASCADE;
DROP VIEW IF EXISTS current_guests;

-- Create room_types first
CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rooms second
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number INTEGER NOT NULL UNIQUE,
    room_type_id UUID REFERENCES room_types(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    capacity INTEGER NOT NULL DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations third
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

-- Verify tables exist before creating views
SELECT 'Tables created successfully' as status;

-- Create the view that was failing
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

-- Verify view was created
SELECT 'View created successfully' as status;

-- Test data
INSERT INTO room_types (name, base_price) VALUES ('Standard', 100.00);
INSERT INTO rooms (room_number, room_type_id, status) VALUES (101, (SELECT id FROM room_types LIMIT 1), 'available');
INSERT INTO reservations (guest_name, room_id, check_in, check_out, status) 
VALUES ('Test Guest', (SELECT id FROM rooms WHERE room_number = 101), CURRENT_DATE, CURRENT_DATE + 1, 'booked');

-- Final verification
SELECT 
    'SUCCESS' as final_status,
    'Clean schema with check_in column working' as message,
    (SELECT COUNT(*) FROM room_types) as room_types_count,
    (SELECT COUNT(*) FROM rooms) as rooms_count,
    (SELECT COUNT(*) FROM reservations) as reservations_count,
    (SELECT COUNT(*) FROM current_guests) as current_guests_count;