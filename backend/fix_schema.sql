-- Run this in your Supabase SQL Editor to fix the 500 error
ALTER TABLE circles ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Update existing rows to have 'active' status if they are null
UPDATE circles SET status = 'active' WHERE status IS NULL;
