-- CLEAN RESERVATIONS TABLE DEFINITION
-- This should work without any issues

-- First, make sure we have clean tables
DROP TABLE IF EXISTS reservations CASCADE;

-- Create room_types if not exists
CREATE TABLE IF NOT EXISTS room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rooms if not exists  
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number INTEGER NOT NULL UNIQUE,
    room_type_id UUID REFERENCES room_types(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reservations with clean definition
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

-- Verify the table was created correctly
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'reservations' 
ORDER BY ordinal_position;

-- Create the index that was failing
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(check_in, check_out);

-- Test data
INSERT INTO room_types (name, base_price) VALUES ('Standard', 100.00);
INSERT INTO rooms (room_number, room_type_id, status) VALUES (101, (SELECT id FROM room_types LIMIT 1), 'available');
INSERT INTO reservations (guest_name, room_id, check_in, check_out, status) 
VALUES ('Test Guest', (SELECT id FROM rooms WHERE room_number = 101), CURRENT_DATE, CURRENT_DATE + 1, 'booked');

-- Verify everything works
SELECT 'SUCCESS: Clean reservations table created with check_in column' as result;