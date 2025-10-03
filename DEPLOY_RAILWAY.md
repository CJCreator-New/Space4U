# 🚂 Deploy to Railway (5 minutes)

## Quick Deploy Steps

### 1. Commit Backend Code
```bash
git add backend/
git commit -m "Add backend API"
git push origin main
```

### 2. Deploy to Railway
1. Visit [railway.app](https://railway.app)
2. Click **"Login"** → **"Login with GitHub"**
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose **"Space4U"** repository
6. Click **"Deploy Now"**

### 3. Configure Service
1. Click on the deployed service card
2. Go to **"Settings"** tab
3. Scroll to **"Service Settings"**
4. Set **Root Directory**: `backend`
5. Set **Start Command**: `npm start`
6. Click **"Save"**

### 4. Add Environment Variables
1. Go to **"Variables"** tab
2. Click **"New Variable"** and add each:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

3. Click **"Add"** for each variable

### 5. Get Your API URL
1. Go to **"Settings"** tab
2. Scroll to **"Domains"**
3. Copy the generated URL: `https://xxxxx.railway.app`
4. Test it: `https://xxxxx.railway.app/health`

---

## ✅ Verification

Visit your Railway URL + `/health`:
```
https://xxxxx.railway.app/health
```

Should return:
```json
{"status":"ok","timestamp":"2025-..."}
```

---

## 🎯 Update Frontend

Add to `.env` in root:
```env
VITE_API_URL=https://xxxxx.railway.app
```

---

## 💰 Free Tier Info

- **$5 credit/month** (renews monthly)
- **~500 hours runtime** (enough for 24/7 with light traffic)
- **Sleeps after 30min inactivity** (wakes in ~10s)
- **Upgrade**: $5/month for always-on

---

## 🚨 If Railway Sleeps

Use [cron-job.org](https://cron-job.org) (free):
1. Create account
2. New cron job
3. URL: `https://xxxxx.railway.app/health`
4. Schedule: Every 10 minutes
5. Keeps your API awake!

---

**Your backend is now live! 🎉**
