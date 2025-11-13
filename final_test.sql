-- FINAL TEST - Verify the complete fix works
-- This should run without ANY foreign key errors

-- Clean slate
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;

-- Room Types
CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL
);

-- Rooms (with room_number for display, id for PK)
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number INTEGER NOT NULL UNIQUE,
    room_type_id UUID REFERENCES room_types(id),
    status VARCHAR(20) NOT NULL DEFAULT 'available'
);

-- Reservations (with room_id UUID foreign key)
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name VARCHAR(200) NOT NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'booked'
);

-- Test data
INSERT INTO room_types (name, base_price) VALUES ('Standard', 100.00);
INSERT INTO rooms (room_number, room_type_id, status) VALUES (101, (SELECT id FROM room_types LIMIT 1), 'available');
INSERT INTO reservations (guest_name, room_id, check_in, check_out) 
VALUES ('Test Guest', (SELECT id FROM rooms WHERE room_number = 101), CURRENT_DATE, CURRENT_DATE + 1);

-- Verify everything works
SELECT 
    'SUCCESS' as status,
    rt.name as room_type,
    r.room_number,
    r.status as room_status,
    res.guest_name,
    res.check_in,
    res.check_out
FROM rooms r
JOIN room_types rt ON r.room_type_id = rt.id  
LEFT JOIN reservations res ON res.room_id = r.id
WHERE r.room_number = 101;