-- Check current properties table structure and fix it
-- This script handles the case where properties table exists but with wrong schema

DO $$
BEGIN
    -- Check if properties table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'properties' AND table_schema = 'public') THEN
        -- Check if it has the right columns
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'properties' AND column_name = 'city') THEN
            -- Drop and recreate with correct schema
            DROP TABLE properties CASCADE;

            CREATE TABLE properties (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT NOT NULL,
                type TEXT CHECK (type IN ('hotel', 'resort', 'motel', 'hostel', 'apartment', 'vacation_rental', 'service', 'pension')) DEFAULT 'hotel',
                address TEXT NOT NULL,
                city TEXT NOT NULL,
                country TEXT NOT NULL,
                phone TEXT,
                email TEXT,
                website TEXT,
                total_rooms INTEGER NOT NULL DEFAULT 0,
                currency TEXT NOT NULL DEFAULT 'CZK',
                timezone TEXT NOT NULL DEFAULT 'Europe/Prague',
                status TEXT CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        END IF;
    ELSE
        -- Create table if it doesn't exist
        CREATE TABLE properties (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            type TEXT CHECK (type IN ('hotel', 'resort', 'motel', 'hostel', 'apartment', 'vacation_rental', 'service', 'pension')) DEFAULT 'hotel',
            address TEXT NOT NULL,
            city TEXT NOT NULL,
            country TEXT NOT NULL,
            phone TEXT,
            email TEXT,
            website TEXT,
            total_rooms INTEGER NOT NULL DEFAULT 0,
            currency TEXT NOT NULL DEFAULT 'CZK',
            timezone TEXT NOT NULL DEFAULT 'Europe/Prague',
            status TEXT CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
        );
    END IF;
END $$;

-- Now create property_settings table if it doesn't exist
CREATE TABLE IF NOT EXISTS property_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    check_in_time TIME DEFAULT '14:00',
    check_out_time TIME DEFAULT '10:00',
    cancellation_policy TEXT,
    pet_policy TEXT CHECK (pet_policy IN ('allowed', 'not_allowed', 'fee')) DEFAULT 'not_allowed',
    smoking_policy TEXT CHECK (smoking_policy IN ('allowed', 'not_allowed', 'designated_areas')) DEFAULT 'not_allowed',
    parking_available BOOLEAN DEFAULT false,
    wifi_available BOOLEAN DEFAULT true,
    breakfast_included BOOLEAN DEFAULT false,
    gym_available BOOLEAN DEFAULT false,
    pool_available BOOLEAN DEFAULT false,
    spa_available BOOLEAN DEFAULT false,
    restaurant_available BOOLEAN DEFAULT false,
    room_service_available BOOLEAN DEFAULT false,
    concierge_available BOOLEAN DEFAULT false,
    twenty_four_hour_front_desk BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(property_id)
);

-- Add property_id columns to existing tables
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE housekeeping ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE packages ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE events ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE employees ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE departments ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE guest_accounts ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE payments ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE room_service_orders ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS property_id UUID REFERENCES properties(id) ON DELETE CASCADE;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_rooms_property_id ON rooms(property_id);
CREATE INDEX IF NOT EXISTS idx_reservations_property_id ON reservations(property_id);
CREATE INDEX IF NOT EXISTS idx_housekeeping_property_id ON housekeeping(property_id);
CREATE INDEX IF NOT EXISTS idx_packages_property_id ON packages(property_id);
CREATE INDEX IF NOT EXISTS idx_events_property_id ON events(property_id);
CREATE INDEX IF NOT EXISTS idx_employees_property_id ON employees(property_id);
CREATE INDEX IF NOT EXISTS idx_departments_property_id ON departments(property_id);
CREATE INDEX IF NOT EXISTS idx_guest_accounts_property_id ON guest_accounts(property_id);
CREATE INDEX IF NOT EXISTS idx_invoices_property_id ON invoices(property_id);
CREATE INDEX IF NOT EXISTS idx_payments_property_id ON payments(property_id);
CREATE INDEX IF NOT EXISTS idx_room_service_orders_property_id ON room_service_orders(property_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_property_id ON maintenance_requests(property_id);
CREATE INDEX IF NOT EXISTS idx_reports_property_id ON reports(property_id);
CREATE INDEX IF NOT EXISTS idx_property_settings_property_id ON property_settings(property_id);

-- Insert sample data (only if table is empty)
INSERT INTO properties (name, type, address, city, country, phone, email, website, total_rooms, currency, timezone, status)
SELECT * FROM (VALUES
    ('Hotel Praha Centrum', 'hotel'::TEXT, 'Husova 15', 'Praha 1', 'Česká republika', '+420 222 551 234', 'info@hotelprahacentrum.cz', 'https://hotelprahacentrum.cz', 45, 'CZK', 'Europe/Prague', 'active'),
    ('Penzion U Tří Piv', 'pension'::TEXT, 'Křižovatka 112', 'Český Krumlov', 'Česká republika', '+420 380 712 345', 'info@utripiv.cz', 'https://utripiv.cz', 12, 'CZK', 'Europe/Prague', 'active'),
    ('Wellness Resort Lázně', 'resort'::TEXT, 'Lázeňská 28', 'Karlovy Vary', 'Česká republika', '+420 353 224 567', 'rezervace@wellnesslazne.cz', 'https://wellnesslazne.cz', 68, 'CZK', 'Europe/Prague', 'active')
) AS v(name, type, address, city, country, phone, email, website, total_rooms, currency, timezone, status)
WHERE NOT EXISTS (SELECT 1 FROM properties LIMIT 1);

-- Insert property settings
INSERT INTO property_settings (property_id, check_in_time, check_out_time, wifi_available, twenty_four_hour_front_desk)
SELECT p.id, '14:00', '10:00', true, true
FROM properties p
WHERE NOT EXISTS (SELECT 1 FROM property_settings ps WHERE ps.property_id = p.id);

-- Update existing data
UPDATE rooms SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE reservations SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE housekeeping SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE packages SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE events SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE employees SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE departments SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE guest_accounts SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE invoices SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE payments SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE room_service_orders SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE maintenance_requests SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

UPDATE reports SET property_id = (SELECT id FROM properties ORDER BY created_at LIMIT 1)
WHERE property_id IS NULL;

-- Create views
DROP VIEW IF EXISTS current_guests;
CREATE VIEW current_guests AS
SELECT
    r.id,
    r.guest_name,
    r.guest_email,
    r.guest_phone,
    r.nationality,
    r.passport_number,
    r.number_of_guests,
    r.room_id,
    r.room_type_id,
    r.check_in,
    r.check_out,
    r.status,
    r.total_amount,
    r.paid_amount,
    r.special_requests,
    r.created_at,
    r.updated_at,
    r.property_id,
    rm.room_number as assigned_room,
    rt.name as room_type,
    p.name as property_name
FROM reservations r
LEFT JOIN rooms rm ON r.room_id = rm.id
LEFT JOIN room_types rt ON r.room_type_id = rt.id
LEFT JOIN properties p ON r.property_id = p.id
WHERE r.status = 'checked_in'
ORDER BY r.check_in DESC;

-- Create property summary view
DROP VIEW IF EXISTS property_summary;
CREATE VIEW property_summary AS
SELECT
    p.id,
    p.name,
    p.type,
    p.city,
    p.country,
    p.total_rooms,
    p.status as property_status,
    COUNT(DISTINCT r.id) as total_reservations,
    COUNT(DISTINCT CASE WHEN r.status = 'checked_in' THEN r.id END) as current_guests,
    COUNT(DISTINCT rm.id) as total_rooms_count,
    COUNT(DISTINCT CASE WHEN rm.status = 'available' THEN rm.id END) as available_rooms,
    COUNT(DISTINCT CASE WHEN rm.status = 'occupied' THEN rm.id END) as occupied_rooms,
    COUNT(DISTINCT e.id) as total_employees
FROM properties p
LEFT JOIN reservations r ON p.id = r.property_id
LEFT JOIN rooms rm ON p.id = rm.property_id
LEFT JOIN employees e ON p.id = e.property_id
GROUP BY p.id, p.name, p.type, p.city, p.country, p.total_rooms, p.status;

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_settings ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
DROP POLICY IF EXISTS "Allow all operations on properties" ON properties;
DROP POLICY IF EXISTS "Allow all operations on property_settings" ON property_settings;

CREATE POLICY "Allow all operations on properties" ON properties FOR ALL USING (true);
CREATE POLICY "Allow all operations on property_settings" ON property_settings FOR ALL USING (true);

-- Create utility function
CREATE OR REPLACE FUNCTION get_property_stats(property_uuid UUID)
RETURNS TABLE (
    total_rooms BIGINT,
    available_rooms BIGINT,
    occupied_rooms BIGINT,
    current_guests BIGINT,
    total_reservations BIGINT,
    pending_housekeeping BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        (SELECT COUNT(*) FROM rooms WHERE property_id = property_uuid) as total_rooms,
        (SELECT COUNT(*) FROM rooms WHERE property_id = property_uuid AND status = 'available') as available_rooms,
        (SELECT COUNT(*) FROM rooms WHERE property_id = property_uuid AND status = 'occupied') as occupied_rooms,
        (SELECT COUNT(*) FROM reservations WHERE property_id = property_uuid AND status = 'checked_in') as current_guests,
        (SELECT COUNT(*) FROM reservations WHERE property_id = property_uuid) as total_reservations,
        (SELECT COUNT(*) FROM housekeeping WHERE property_id = property_uuid AND status IN ('pending', 'in_progress')) as pending_housekeeping;
END;
$$ LANGUAGE plpgsql;

-- Final verification
SELECT
    'SUCCESS' as status,
    'Multi-property schema fixed and implemented' as message,
    (SELECT COUNT(*) FROM properties) as properties_count,
    (SELECT COUNT(*) FROM property_settings) as property_settings_count,
    (SELECT COUNT(*) FROM property_summary) as properties_with_stats;