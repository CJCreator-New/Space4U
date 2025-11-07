-- Circles Setup - Works with existing tables

-- Step 1: Add missing columns to existing table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='circles' AND column_name='members') THEN
    ALTER TABLE circles ADD COLUMN members INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='circles' AND column_name='posts') THEN
    ALTER TABLE circles ADD COLUMN posts INTEGER DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='circles' AND column_name='color') THEN
    ALTER TABLE circles ADD COLUMN color VARCHAR(7);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='circles' AND column_name='icon') THEN
    ALTER TABLE circles ADD COLUMN icon VARCHAR(10);
  END IF;
END $$;

-- Step 2: Insert data (skips duplicates)
INSERT INTO circles (name, description, icon, members, posts, color, category)
SELECT * FROM (VALUES
  ('Anxiety Support', 'Safe space for managing anxiety and stress', '🌊', 1247, 892, '#6366F1', 'mental-health'),
  ('Depression Corner', 'You''re not alone in this journey', '🌱', 1583, 1204, '#8B5CF6', 'mental-health'),
  ('Work & Career Stress', 'Navigate workplace challenges together', '💼', 934, 567, '#3B82F6', 'lifestyle'),
  ('Relationship Talk', 'Love, family, and friendship support', '❤️', 1876, 1345, '#EC4899', 'support'),
  ('Student Life', 'Academic pressure and campus struggles', '📚', 756, 423, '#F59E0B', 'lifestyle'),
  ('LGBTQ+ Safe Space', 'Acceptance, understanding, belonging', '🏳️🌈', 1092, 789, '#EF4444', 'support'),
  ('New Parents', 'Parenting wins and struggles', '👶', 623, 334, '#10B981', 'lifestyle'),
  ('General Wellness', 'Daily life and self-care', '✨', 1456, 987, '#14B8A6', 'mental-health')
) AS v(name, description, icon, members, posts, color, category)
WHERE NOT EXISTS (SELECT 1 FROM circles WHERE circles.name = v.name);

-- Step 3: Enable public read
ALTER TABLE circles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read" ON circles;
CREATE POLICY "Allow public read" ON circles FOR SELECT USING (true);

-- Step 4: Verify
SELECT name, members, category FROM circles;
