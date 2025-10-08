# Supabase Configuration Checklist ✅

## Backend Setup Status

Since you already ran all SQL schemas, your database is ready! Just verify these settings:

---

## 1. Authentication Settings

### Go to: Authentication → Providers

**Email Provider:**
- ✅ Enable Email provider
- ✅ Confirm email: **DISABLED** (for faster testing)
  - Or **ENABLED** (for production - users must verify email)

**Recommended for Development:**
```
Confirm email: OFF
```

**For Production:**
```
Confirm email: ON
```

---

## 2. URL Configuration

### Go to: Authentication → URL Configuration

**Site URL:**
```
http://localhost:5173
```

**Redirect URLs:**
```
http://localhost:5173/**
http://localhost:5173/auth
```

---

## 3. Email Templates (Optional)

### Go to: Authentication → Email Templates

If email confirmation is enabled, customize:
- Confirm signup template
- Magic link template
- Change email template

---

## 4. RLS Policies (Already Done ✅)

Since you ran all SQL schemas, these are already set:
- ✅ Profiles policies
- ✅ Moods policies
- ✅ Badges policies
- ✅ Posts/Comments policies
- ✅ All feature tables policies

---

## 5. API Keys (Already in .env ✅)

Your `.env` should have:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## Quick Test

### 1. Disable Email Confirmation (Recommended for Testing)

**Supabase Dashboard:**
1. Go to **Authentication** → **Providers**
2. Click **Email**
3. Toggle **OFF**: "Confirm email"
4. Click **Save**

This allows instant signup without email verification!

### 2. Test Signup Flow

1. Visit: http://localhost:5173
2. Complete onboarding
3. Click "Create Account"
4. Enter email/password
5. Should login immediately (no email confirmation needed)

### 3. Verify in Supabase

**Check user created:**
1. Go to **Authentication** → **Users**
2. See your new user listed

**Check profile created:**
1. Go to **Table Editor** → **profiles**
2. See profile row with your user_id

---

## Common Issues & Fixes

### Issue: "Email not confirmed"
**Fix:** Disable email confirmation in Authentication → Providers → Email

### Issue: "Invalid login credentials"
**Fix:** Make sure you're using the same email/password you signed up with

### Issue: "User already registered"
**Fix:** Either login with existing account or use different email

### Issue: Profile not created after signup
**Fix:** Check RLS policies allow INSERT on profiles table

---

## Production Checklist (When Deploying)

- [ ] Enable email confirmation
- [ ] Update Site URL to production domain
- [ ] Update Redirect URLs to production domain
- [ ] Customize email templates
- [ ] Set up custom SMTP (optional)
- [ ] Enable 2FA (optional)
- [ ] Set password requirements

---

## Summary

✅ **Database**: All tables created (you did this!)  
✅ **RLS Policies**: All set (from SQL schemas)  
✅ **Frontend**: Authentication required  
⚠️ **Action Needed**: Disable email confirmation for testing  

**Next Step:** Go to Supabase → Authentication → Providers → Email → Turn OFF "Confirm email"

Then test signup at http://localhost:5173/auth
