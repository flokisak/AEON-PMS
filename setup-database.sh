#!/bin/bash

# Database Setup Script for PMS Core
# This script helps apply the SQL schema to Supabase

echo "🏨 PMS Core Database Setup"
echo "=========================="

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo "Please install it first: npm install -g supabase"
    exit 1
fi

# Check if we're logged in to Supabase
echo "🔍 Checking Supabase authentication..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run: supabase login"
    exit 1
fi

# Extract project reference from .env.local
SUPABASE_URL=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d'=' -f2)
PROJECT_REF=$(echo $SUPABASE_URL | sed 's/https:\/\/\([^.]*\).*/\1/')

echo "📋 Project Reference: $PROJECT_REF"

# Apply the schema
echo "🚀 Applying database schema..."
supabase db push --db-url $SUPABASE_URL --schema supabase_schema.sql

if [ $? -eq 0 ]; then
    echo "✅ Database schema applied successfully!"
    echo ""
    echo "🎉 Your PMS Core database is now ready!"
    echo "   - All tables have been created"
    echo "   - Row Level Security policies are in place"
    echo "   - Indexes have been created for performance"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Run 'npm run dev' to start the development server"
    echo "   2. Visit http://localhost:3000 to access your PMS"
    echo "   3. Configure your hotel settings in the admin panel"
else
    echo "❌ Failed to apply database schema"
    echo "Please check the error message above and try again"
    exit 1
fi