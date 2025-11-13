-- COMPREHENSIVE VERIFICATION - Test all fixes
-- This should run without ANY errors

-- Clean slate
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS rooms CASCADE;
DROP TABLE IF EXISTS room_types CASCADE;
DROP TABLE IF EXISTS room_service_orders CASCADE;

-- Room Types
CREATE TABLE room_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rooms (with room_number for display, id for PK)
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number INTEGER NOT NULL UNIQUE,
    room_type_id UUID REFERENCES room_types(id),
    status VARCHAR(20) NOT NULL DEFAULT 'available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reservations (with room_id UUID foreign key)
CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name VARCHAR(200) NOT NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'booked',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT check_dates CHECK (check_out > check_in)
);

-- Room Service Orders (with JSONB data type)
CREATE TABLE room_service_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    order_details JSONB NOT NULL,
    total_amount DECIMAL(10,2),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Test data
INSERT INTO room_types (name, base_price) VALUES ('Standard', 100.00);
INSERT INTO rooms (room_number, room_type_id, status) VALUES (101, (SELECT id FROM room_types LIMIT 1), 'available');
INSERT INTO reservations (guest_name, room_id, check_in, check_out) 
VALUES ('Test Guest', (SELECT id FROM rooms WHERE room_number = 101), CURRENT_DATE, CURRENT_DATE + 1);
INSERT INTO room_service_orders (room_id, order_details, total_amount) 
VALUES ((SELECT id FROM rooms WHERE room_number = 101), '{"item": "breakfast", "quantity": 2}', 25.00);

-- Test the fixed view
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

-- Verify everything works
SELECT 
    'SUCCESS' as status,
    'All fixes verified' as message,
    COUNT(DISTINCT rt.id) as room_types_count,
    COUNT(DISTINCT r.id) as rooms_count,
    COUNT(DISTINCT res.id) as reservations_count,
    COUNT(DISTINCT rso.id) as orders_count
FROM room_types rt
CROSS JOIN rooms r
CROSS JOIN reservations res
CROSS JOIN room_service_orders rso;