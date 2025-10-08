# Data Migration Guide ✅

## Overview

Automatic data migration from localStorage to Supabase is now implemented!

---

## How It Works

### Automatic Migration
When a user logs in, the system automatically:
1. Checks if migration is needed
2. Syncs moods, profile, and badges to Supabase
3. Marks migration as complete
4. Shows success notification

### What Gets Migrated

✅ **Moods** - All mood entries with dates, ratings, notes, tags  
✅ **Profile** - Username, avatar, age confirmation, interests  
✅ **Badges** - Unlocked badges with progress and timestamps  

---

## Implementation Files

### Core Services
- `src/services/migrationService.js` - Migration logic
- `src/services/moodService.js` - Mood CRUD operations
- `src/hooks/useMoodSync.js` - Hook for mood syncing

### UI Components
- `src/components/MigrationStatus.jsx` - Migration notification UI
- `src/contexts/AuthContext.jsx` - Auto-migration on login

---

## Usage

### For Users
1. **Login** - Migration happens automatically
2. **Notification** - See sync status in bottom-right corner
3. **Manual Sync** - Click "Sync Now" if needed

### For Developers

**Check migration status:**
```javascript
import { migrationService } from './services/migrationService'

if (migrationService.isMigrationComplete()) {
  console.log('Migration done!')
}
```

**Use mood sync hook:**
```javascript
import { useMoodSync } from './hooks/useMoodSync'

function MyComponent() {
  const { moods, loading, syncing, saveMood } = useMoodSync()
  
  // Save mood (auto-syncs to Supabase if logged in)
  await saveMood('2024-01-15', { rating: 4, note: 'Great day!' })
}
```

**Manual migration:**
```javascript
import { migrationService } from './services/migrationService'

const results = await migrationService.migrateAll(userId)
console.log(results)
// { moods: { success: true, count: 10 }, profile: { success: true }, badges: { success: true, count: 3 } }
```

---

## Migration Flow

```
User logs in
    ↓
Check if migration complete
    ↓
NO → Start migration
    ↓
Migrate moods (upsert by user_id + date)
    ↓
Migrate profile (upsert by user_id)
    ↓
Migrate badges (upsert by user_id + badge_id)
    ↓
Mark migration complete
    ↓
Show success notification
```

---

## Data Mapping

### Moods
```javascript
localStorage: safespace_moods
{
  "2024-01-15": { rating: 4, note: "Great day", tags: ["happy"] }
}

Supabase: moods table
{
  user_id: "uuid",
  date: "2024-01-15",
  rating: 4,
  note: "Great day",
  tags: ["happy"]
}
```

### Profile
```javascript
localStorage: safespace_user_profile
{
  username: "john_doe",
  avatar: "avatar1.png",
  ageConfirmed: true,
  interests: ["anxiety", "depression"]
}

Supabase: profiles table
{
  id: "uuid",
  username: "john_doe",
  avatar_url: "avatar1.png",
  age_confirmed: true,
  interests: ["anxiety", "depression"]
}
```

### Badges
```javascript
localStorage: safespace_badges
{
  "first_mood": { unlocked: true, unlockedAt: "2024-01-15", progress: 1 }
}

Supabase: user_badges table
{
  user_id: "uuid",
  badge_id: "first_mood",
  unlocked_at: "2024-01-15",
  progress: 1
}
```

---

## Testing

### Test Migration
1. Add test data to localStorage:
```javascript
localStorage.setItem('safespace_moods', JSON.stringify({
  "2024-01-15": { rating: 4, note: "Test mood" }
}))
```

2. Login at http://localhost:5173/auth
3. Check notification appears
4. Click "Sync Now"
5. Verify in Supabase dashboard

### Verify Data
```javascript
// In browser console after login
import { supabase } from './src/lib/supabase'

// Check moods
const { data } = await supabase.from('moods').select('*')
console.log(data)

// Check profile
const { data: profile } = await supabase.from('profiles').select('*')
console.log(profile)
```

---

## Features

✅ **Automatic** - Runs on login  
✅ **Idempotent** - Safe to run multiple times  
✅ **Upsert** - Updates existing records  
✅ **Conflict Resolution** - Uses user_id + date/badge_id  
✅ **Error Handling** - Graceful failure with retry  
✅ **UI Feedback** - Visual notification  
✅ **Manual Trigger** - User can sync anytime  

---

## Next Steps

### Phase 2: Bi-directional Sync
- [ ] Sync from Supabase to localStorage on login
- [ ] Handle conflicts (last-write-wins)
- [ ] Offline queue for pending changes

### Phase 3: Real-time Sync
- [ ] Real-time subscriptions for multi-device
- [ ] Instant updates across devices
- [ ] Conflict resolution UI

---

## Troubleshooting

### Migration not triggering
**Fix**: Check `safespace_migration_complete` in localStorage. Delete it to re-trigger.

### Data not appearing in Supabase
**Fix**: Check browser console for errors. Verify RLS policies are enabled.

### Duplicate entries
**Fix**: Migration uses upsert with conflict resolution. Check unique constraints.

---

**Status**: ✅ Complete  
**Auto-migration**: Enabled  
**Manual sync**: Available  
**Next**: Real-time features
