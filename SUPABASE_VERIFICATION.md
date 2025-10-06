# 🔍 Supabase Backend Verification Checklist

## ✅ What to Check in Supabase Dashboard

### 1. Database Tables (Table Editor)

Visit: https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb/editor

#### Check These Tables Exist:
- [ ] **profiles** - User profiles
- [ ] **moods** - Mood tracking data
- [ ] **circles** - Community circles
- [ ] **circle_members** - Circle memberships
- [ ] **posts** - User posts
- [ ] **comments** - Post comments
- [ ] **user_badges** - Achievement badges

---

### 2. Authentication Settings

Visit: https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb/auth/users

#### Verify Settings:
- [ ] **Email Auth** is enabled
- [ ] **Email Confirmations** (can be disabled for testing)
- [ ] **Site URL** set correctly (http://localhost:5173 for dev)

---

### 3. Row Level Security (RLS)

Visit: https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb/auth/policies

#### Check RLS is Enabled:
- [ ] **profiles** - RLS enabled
- [ ] **moods** - RLS enabled  
- [ ] **posts** - RLS enabled
- [ ] **comments** - RLS enabled
- [ ] **user_badges** - RLS enabled

#### Check Policies Exist:

**profiles table:**
- [ ] "Public profiles viewable" (SELECT)
- [ ] "Users update own profile" (UPDATE)

**moods table:**
- [ ] "Users view own moods" (SELECT)
- [ ] "Users insert own moods" (INSERT)

**posts table:**
- [ ] "Posts viewable by all" (SELECT)
- [ ] "Users create posts" (INSERT)

**comments table:**
- [ ] "Comments viewable by all" (SELECT)
- [ ] "Users create comments" (INSERT)

---

### 4. Demo Data (Circles)

Visit: https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb/editor

#### Check circles table has data:
- [ ] Anxiety Support
- [ ] Depression Warriors
- [ ] Student Stress
- [ ] Work-Life Balance
- [ ] LGBTQ+ Safe Space

---

### 5. API Keys

Visit: https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb/settings/api

#### Verify you have:
- [ ] **Project URL**: `https://jzxbovqisripvsxvmkbb.supabase.co`
- [ ] **anon public key**: Starts with `eyJhbGc...`
- [ ] **service_role key**: Starts with `eyJhbGc...` (keep secret!)

---

## 🔧 If Something is Missing

### Missing Tables?
Run this in SQL Editor:
```sql
-- Copy entire content from backend/supabase/schema.sql
-- Paste and run in Supabase SQL Editor
```

### Missing Demo Circles?
Run this in SQL Editor:
```sql
-- Copy entire content from backend/supabase/seed.sql
-- Paste and run in Supabase SQL Editor
```

### Missing RLS Policies?
They should be created by schema.sql. If missing, re-run the schema.

---

## 🧪 Test Your Setup

### Test 1: Can Create User?
```bash
# 1. Go to http://localhost:5173/auth
# 2. Sign up with test email
# 3. Check: Authentication → Users (should see new user)
# 4. Check: Table Editor → profiles (should see profile)
```

### Test 2: Can Save Mood?
```bash
# 1. Login with test user
# 2. Log a mood on home page
# 3. Check: Table Editor → moods (should see mood entry)
```

### Test 3: Can Load Circles?
```bash
# 1. Go to http://localhost:5173/circles
# 2. Should see 5 demo circles
# 3. Check: Table Editor → circles (should have 5 rows)
```

---

## 🚨 Common Issues & Fixes

### Issue: "relation does not exist"
**Fix**: Tables not created. Run `schema.sql` in SQL Editor.

### Issue: "new row violates row-level security policy"
**Fix**: RLS policies missing. Re-run `schema.sql`.

### Issue: "permission denied for table"
**Fix**: Check you're using correct API key (anon key for client).

### Issue: No circles showing
**Fix**: Run `seed.sql` to add demo circles.

### Issue: Can't create profile
**Fix**: Check profiles table exists and RLS policies are set.

---

## ✅ Verification SQL Queries

Run these in SQL Editor to verify setup:

### Check all tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected output:**
- circle_members
- circles
- comments
- moods
- posts
- profiles
- user_badges

### Check RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**All should show**: `rowsecurity = true`

### Check circles data:
```sql
SELECT name, category FROM circles;
```

**Should return 5 circles**

### Check indexes:
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Should see**:
- idx_moods_user_date
- idx_posts_circle
- idx_comments_post

---

## 📊 Current Status Check

### Quick Verification (2 minutes)

1. **Open Supabase Dashboard**
   - https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb

2. **Check Table Editor**
   - Click "Table Editor" in sidebar
   - Should see 7 tables listed

3. **Check circles table**
   - Click on "circles" table
   - Should see 5 rows of data

4. **Check Authentication**
   - Click "Authentication" in sidebar
   - Should see "Email" provider enabled

5. **Check API Settings**
   - Click "Settings" → "API"
   - Copy your keys to `.env` if not done

---

## 🎯 Next Steps After Verification

### If Everything is ✅:
1. Test signup/login flow
2. Test mood logging
3. Verify data appears in Supabase
4. Move to deployment

### If Something is ❌:
1. Run missing SQL scripts
2. Check error messages
3. Verify API keys in `.env`
4. Re-test after fixes

---

## 💡 Pro Tips

1. **Use SQL Editor**: Fastest way to check/fix database
2. **Check Logs**: Settings → Logs shows all queries
3. **Test Policies**: Use "RLS disabled" temporarily to debug
4. **Backup Data**: Export tables before making changes

---

## 🔗 Quick Links

- **Dashboard**: https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb
- **Table Editor**: https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb/editor
- **SQL Editor**: https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb/sql
- **Authentication**: https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb/auth/users
- **API Settings**: https://supabase.com/dashboard/project/jzxbovqisripvsxvmkbb/settings/api

---

**Go through this checklist now and verify your Supabase setup! ✅**
