-- MINIMAL TEST - Isolate the check_in column issue
-- Run this step by step to see where it fails

-- Step 1: Create reservations table only
DROP TABLE IF EXISTS reservations CASCADE;

CREATE TABLE reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_name VARCHAR(200) NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'booked',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Verify table was created with check_in column
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'reservations' 
AND column_name IN ('check_in', 'check_out');

-- Step 3: Try to create index on check_in
CREATE INDEX IF NOT EXISTS idx_test_check_in ON reservations(check_in);

-- Step 4: Verify index was created
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'reservations' 
AND indexname = 'idx_test_check_in';

-- If this works, the issue is elsewhere in the schema
SELECT 'SUCCESS: check_in column and index created properly' as result;