# Supabase Setup Guide - Mandatory Authentication

Space4U now requires Supabase authentication. Users must sign up/login before accessing any features.

## Quick Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new project
4. Wait for database to initialize

### 2. Get Credentials
1. Go to Project Settings → API
2. Copy `Project URL`
3. Copy `anon public` key

### 3. Configure Environment
Create `.env` file in project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Run Database Migrations
Execute SQL files in Supabase SQL Editor in this order:

1. `backend/supabase/schema.sql` - Core tables
2. `backend/supabase/gratitude_schema.sql` - Gratitude features
3. `backend/supabase/therapeutic_tools_schema.sql` - Therapeutic tools
4. `backend/supabase/priority1_features_schema.sql` - Priority 1 features
5. `backend/supabase/priority2_features_schema.sql` - Priority 2 features
6. `backend/supabase/priority3_gamification_schema.sql` - Gamification
7. `backend/supabase/priority4_social_schema.sql` - Social features
8. `backend/supabase/priority5_6_schema.sql` - Analytics & professional
9. `backend/supabase/priority7_schema.sql` - Technical features

### 5. Enable Email Authentication
1. Go to Authentication → Providers
2. Enable Email provider
3. Configure email templates (optional)

### 6. Start Application
```bash
npm run dev
```

## User Flow

1. **First Visit** → Auth page (signup/login required)
2. **After Signup** → Email confirmation (check inbox)
3. **After Login** → Onboarding flow (5 steps)
4. **After Onboarding** → Full app access

## Features

✅ **Mandatory Authentication** - No local-only mode
✅ **Email/Password Signup** - Secure user accounts
✅ **Email Verification** - Confirm user emails
✅ **Protected Routes** - All routes require authentication
✅ **Data Migration** - Local data syncs to Supabase after login
✅ **Session Management** - Persistent login sessions

## Troubleshooting

### "Backend not configured" Error
- Check `.env` file exists in project root
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Restart dev server after adding `.env`

### "Invalid login credentials" Error
- User may not exist - try signing up first
- Check email confirmation status in Supabase dashboard
- Verify password meets minimum requirements (6+ characters)

### Email Not Received
- Check spam folder
- Verify email provider settings in Supabase
- Use Supabase dashboard to manually confirm user

### Database Errors
- Ensure all SQL migrations are executed
- Check Supabase logs for specific errors
- Verify RLS policies are enabled

## Security Notes

- Anon key is safe to expose in client code
- Row Level Security (RLS) protects user data
- Users can only access their own data
- All sensitive operations require authentication

## Development Mode

For testing without email confirmation:
1. Go to Supabase → Authentication → Settings
2. Disable "Enable email confirmations"
3. Users can login immediately after signup

## Production Checklist

- [ ] Email confirmation enabled
- [ ] Custom email templates configured
- [ ] RLS policies tested
- [ ] Rate limiting configured
- [ ] Error tracking enabled
- [ ] Backup strategy in place
