# 🎯 Free Tier Backend - Complete Setup Guide

**Total Time**: 30-45 minutes  
**Total Cost**: ₹0/month  
**Capacity**: 50,000 users, 500MB data

---

## 🚀 Step-by-Step Setup

### Part 1: Supabase (15 mins)

1. **Create Project**
   - Visit [supabase.com](https://supabase.com) → Sign up with GitHub
   - New project → Name: `space4u-db` → Region: Singapore → Free plan
   - Save database password!

2. **Run Schema**
   - SQL Editor → New query → Paste `backend/supabase/schema.sql` → Run
   - New query → Paste `backend/supabase/seed.sql` → Run

3. **Get Credentials**
   - Settings → API → Copy:
     - Project URL
     - anon public key
     - service_role key

### Part 2: Backend (10 mins)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with Supabase credentials
npm run dev
```

Visit http://localhost:3000/health

### Part 3: Deploy to Railway (10 mins)

1. [railway.app](https://railway.app) → Login with GitHub
2. New Project → Deploy from GitHub → Select Space4U
3. Settings → Root Directory: `backend`
4. Variables → Add all from `.env`
5. Copy generated URL

### Part 4: Connect Frontend (5 mins)

```bash
npm install @supabase/supabase-js
```

Create `.env`:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_API_URL=https://xxxxx.railway.app
```

---

## ✅ Verification

- [ ] Supabase project active
- [ ] Backend runs locally
- [ ] Backend deployed to Railway
- [ ] API URL accessible
- [ ] Frontend env vars set

---

## 💰 Free Tier Limits

**Supabase**: 500MB DB, 50K users, 2GB bandwidth  
**Railway**: $5 credit/month (~500 hours)  
**Render Alternative**: 750 hours/month

---

## 🚨 Troubleshooting

**Cannot connect**: Check Supabase URL and keys  
**Railway crashed**: Verify env vars, check logs  
**CORS error**: Update FRONTEND_URL in backend  

---

## 🎯 Next Steps

1. Migrate localStorage to Supabase
2. Add authentication flow
3. Test with 5-10 users
4. Prepare demo

**You're ready to build on 100% free tier! 🎉**
