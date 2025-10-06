-- 🔍 Supabase Verification Script
-- Run this in Supabase SQL Editor to verify your setup

-- 1. Check all tables exist
SELECT 'Tables Check' as test, table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected: 7 tables (circle_members, circles, comments, moods, posts, profiles, user_badges)

-- 2. Check RLS is enabled
SELECT 'RLS Check' as test, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected: All tables should have rowsecurity = true

-- 3. Check circles data exists
SELECT 'Circles Data' as test, COUNT(*) as circle_count FROM circles;

-- Expected: 5 circles

-- 4. List all circles
SELECT 'Circle List' as test, name, category FROM circles ORDER BY name;

-- Expected: 5 circles with names and categories

-- 5. Check RLS policies
SELECT 'RLS Policies' as test, tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Expected: Multiple policies for profiles, moods, posts, comments

-- 6. Check indexes
SELECT 'Indexes' as test, indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename;

-- Expected: idx_moods_user_date, idx_posts_circle, idx_comments_post

-- 7. Check table structures
SELECT 'Profiles Columns' as test, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

SELECT 'Moods Columns' as test, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'moods'
ORDER BY ordinal_position;

-- ✅ If all queries return expected results, your Supabase is ready!
-- ❌ If any query fails or returns unexpected results, re-run schema.sql
