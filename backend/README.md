# Space4U Backend - Free Tier Setup

## 🎯 100% Free Development Stack

### Services Used
- **Supabase**: Database + Auth + Storage (Free tier: 500MB DB, 50K MAU)
- **Railway/Render**: API hosting (Free tier: $5 credit/month or 750 hours)
- **Vercel**: Frontend hosting (Already set up)

---

## 🚀 Quick Setup (15 minutes)

### Step 1: Supabase Setup
1. Go to [supabase.com](https://supabase.com)
2. Create free account
3. Create new project (choose region closest to you)
4. Wait 2 minutes for database provisioning
5. Go to **SQL Editor** → Run `supabase/schema.sql`
6. Run `supabase/seed.sql` for demo data
7. Go to **Settings** → **API** → Copy:
   - Project URL
   - Anon public key
   - Service role key (keep secret!)

### Step 2: Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

### Step 3: Deploy to Railway (Free)
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your Space4U repo
5. Set root directory to `/backend`
6. Add environment variables from `.env`
7. Deploy! (Gets $5 free credit/month)

### Alternative: Deploy to Render (Free)
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. New → Web Service → Connect repo
4. Root directory: `backend`
5. Build: `npm install`
6. Start: `npm start`
7. Add environment variables
8. Deploy! (750 free hours/month)

---

## 📡 API Endpoints

### Authentication
- Uses Supabase Auth (built-in)
- Frontend calls `supabase.auth.signUp()` directly

### Moods
- `GET /api/moods` - Get user's moods
- `POST /api/moods` - Log new mood

### Circles
- `GET /api/circles` - List all circles
- `GET /api/circles/:id/posts` - Get circle posts

### Posts
- `POST /api/posts` - Create post
- `POST /api/posts/:id/comments` - Add comment

---

## 💰 Free Tier Limits

### Supabase Free
- ✅ 500MB database (enough for 10K+ users)
- ✅ 1GB file storage
- ✅ 50,000 monthly active users
- ✅ 2GB bandwidth
- ✅ Unlimited API requests

### Railway Free
- ✅ $5 credit/month (~500 hours)
- ✅ 500MB RAM
- ✅ 1GB disk
- ⚠️ Sleeps after 30min inactivity

### Render Free
- ✅ 750 hours/month (1 service 24/7)
- ✅ 512MB RAM
- ⚠️ Spins down after 15min inactivity

---

**Total Cost: ₹0/month for development & demo! 🎉**
