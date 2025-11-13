# Database Setup Instructions

## ⚠️ Important Update - Schema Fixed

The original schema had issues with PostgreSQL reserved keywords. The schema has been fixed:
- ✅ Fixed `rooms("number")` column references (was causing foreign key errors)
- ✅ Fixed `timestamp` column name conflicts
- ✅ All foreign key constraints now work properly

## Quick Setup with Supabase Dashboard

1. **Open your Supabase project**
   - Go to https://supabase.com/dashboard
   - Select your project (qbphjzuzjaoifcoziubn)

2. **Apply the SQL Schema**
   - Go to the "SQL Editor" tab
   - Copy and paste the entire contents of `supabase_schema.sql` (now fixed!)
   - Click "Run" to execute the schema

3. **Optional: Test with Minimal Schema**
   - If you want to test first, use `test_schema.sql` 
   - This creates just the essential tables to verify everything works

3. **Verify Setup**
   - Go to "Table Editor" tab
   - You should see all the new tables created
   - Check that Row Level Security (RLS) is enabled

## Alternative: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to your Supabase account
supabase login

# Link to your project
supabase link --project-ref qbphjzuzjaoifcoziubn

# Apply the schema
supabase db push
```

## What the Schema Creates

- **Core Tables**: rooms, room_types, amenities, reservations
- **Czech Compliance**: local_accommodation_fees, foreign_police_reports
- **Billing System**: invoices, payments, guest_accounts
- **Employee Management**: employees, departments, shifts
- **AI Features**: ai_concierge_logs, ai_revenue_suggestions
- **Security**: Row Level Security policies on all tables
- **Performance**: Indexes for common queries

## After Setup

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000

3. Configure your hotel settings in the Admin panel

## Troubleshooting

If you encounter issues:

1. **Permission errors**: Make sure you're using the service role key for schema changes
2. **Table conflicts**: Drop existing tables if needed and re-run the schema
3. **Connection issues**: Verify your .env.local credentials are correct

## Testing the Connection

Once the schema is applied, the application should automatically connect to your database. You can test this by:

1. Starting the dev server
2. Navigating to different modules
3. Checking if data loads correctly (some modules may show empty initially)