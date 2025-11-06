-- Properly enable Row Level Security for user_data table

-- First, ensure RLS is enabled
ALTER TABLE user_data ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own data" ON user_data;
DROP POLICY IF EXISTS "Users can insert own data" ON user_data;
DROP POLICY IF EXISTS "Users can update own data" ON user_data;
DROP POLICY IF EXISTS "Users can delete own data" ON user_data;

-- Create restrictive policies that only allow authenticated users to access their own data
CREATE POLICY "users_select_own_data" ON user_data
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_data" ON user_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_data" ON user_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own_data" ON user_data
  FOR DELETE
  USING (auth.uid() = user_id);